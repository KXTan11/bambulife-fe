import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { getResources } from './utils.js';
import { Link } from "react-router-dom";

class StarWarsTable extends Component {
    constructor() {
        super();
        this.state = {
            type: 'people',
            data: [],
            pages: 0,
            loading: false,
        };

        this.fetchInfo = this.fetchInfo.bind(this);
    }

    fetchInfo(state) {
        this.setState({loading: true});
        getResources(this.state.type, state.page+1, state.filtered && state.filtered.name)
            .then(res => {
                this.setState({
                    data: res.data.results,
                    pages: Math.ceil(res.data.count/10),
                    loading: false
                });
            });
    }


    render() {
        const {data, pages, loading, type } = this.state;
        const columns = [{
            Header: 'Name',
            accessor: 'name',
            Cell: (cellInfo) => {
                let url = cellInfo.original.url.split('/');
                return <Link to={'/'+ type + '/' + url[url.length - 2]}>{cellInfo.original.name}</Link>
            },
            Filter: ({ filter, onChange }) =>
                <input
                    className="form-control"
                    onChange={event => onChange(event.target.value)}
                    style={{ width: "100%" }}
                    value={filter ? filter.value : ""}
                />
        }];
        return (
            <ReactTable
                ref={(refReactTable) => {this.table = refReactTable;}}
                columns={columns}
                manual // Forces table not to paginate or sort automatically, so we can handle it server-side
                data={data}
                pages={pages} // Display the total number of pages
                loading={loading} // Display the loading overlay when we need it
                onFetchData={this.fetchInfo} // Request new data when things change
                filterable
                pageSizeOptions={[10]}
                defaultPageSize={10}
                sortable={false}
                className="-striped -highlight"
                showPaginationTop
                showPaginationBottom
            />
        );
    }
}

export default StarWarsTable;