import axios from 'axios';
import Bluebird from 'bluebird';


function swapiRequest(type, id, params) {
    let url = 'https://swapi.co/api/' + type;
    if (id) {
        url += '/' + id + '/';
    } else {
        if (params) {
            url += params;
        } else {
            url += '/';
        }
    }
    return axios.get(url);
}

function getResourceName(type, id) {
    return swapiRequest(type, id)
        .then(res => {
            return res.data.name || res.data.title;
        });
}

export function getResource(type, id) {
    return swapiRequest(type, id)
        .then(res => {
            let retPromise = Bluebird.resolve(res.data);
            Object.keys(res.data).forEach(k => {
                let d = res.data[k];
                if (d) {
                    if (Array.isArray(d)) {
                        if (d.length > 0 && checkIsLink(d[0])) {
                            retPromise = retPromise.then(data => {
                                return Bluebird.map(d, dd => {
                                    return getDependencyResource(dd);
                                })
                                .then(dd => {
                                    data[k] = dd;
                                    return data;
                                });
                            })
                        }
                    } else {
                        if (checkIsLink(res.data[k])) {
                            retPromise = retPromise.then(data => {
                                return getDependencyResource(res.data[k])
                                    .then(dd => {
                                        data[k] = dd;
                                        return data;
                                    });
                            });
                        }
                    }
                }
            });

            retPromise = retPromise
                .then(function(data) {
                    delete data.url;
                    delete data.edited;
                    delete data.created;
                    return data;
                });
            return retPromise;

            function checkIsLink(d) {
                return d && d.match && d.match(/^https:\/\/swapi.co\/api\//);
            }

            function getDependencyResource(d) {
                let params = d.replace('https://swapi.co/api/', '').split('/');
                return getResourceName(params[0], params[1])
                    .then(name => {
                        return {
                            name: name,
                            type: params[0],
                            id: params[1],
                            link: true
                        }
                    });
            }

        });
}

export function getResources(type, page, search) {
    let param = [];
    if (page) {
        param.push('page=' + page);
    }

    if (search) {
        param.push('search=' + search);
    }
    if (param && param.length > 0) {
        param = '?' + param.join('&');
    } else {
        param = '';
    }
    return swapiRequest(type, null, param);
}
