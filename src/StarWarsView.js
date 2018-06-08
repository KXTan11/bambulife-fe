import React, { Component } from 'react';
import './App.css';
import 'react-table/react-table.css';
import { getResource } from './utils.js';
import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";
import _ from 'lodash';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

const ValueCell = (props) => {
    if (props.value && props.value.link === true) {
        return (<Link to={'/'+ props.value.type + '/' + props.value.id}>{props.value.name}</Link>);
    } else {
        return props.value;
    }
};

const InfoRow = (props) => {
    let cell = [];
    if (Array.isArray(props.info)) {
        props.info.forEach(info => {
            cell.push(
                <div><ValueCell value={info} /></div>
            )
        });
    } else {
        cell.push(<ValueCell value={props.info}/>)
    }
    return (
        <tr>
            <td>
                {props.field}
            </td>
            <td>
                {cell}
            </td>
        </tr>
    )
};

class StarWarsView extends Component {
    constructor() {
        super();
        this.state = {
            data: {},
            loading: false
        };
    }
    componentDidMount () {
        const { type, id } = this.props.match.params;
        this.setState({loading: true});
        getResource(type, id)
            .then(res => {
                let rows = [];
                Object.keys(res).forEach(k => {
                    rows.push(
                        <InfoRow field={_.capitalize(_.lowerCase(k))} info={res[k]}/>
                    )
                });
                this.setState({data: res, rows: rows, loading: false});
            });
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.location.key !== this.props.location.key) {
            window.location.reload();
        }
    }
    render() {

        return (
            <BlockUi blocking={this.state.loading} className="App">
                <header className="App-header">
                    <h1 className="App-title">Star Wars Universe Info</h1>
                    <small><Link to={'/'}>Back to character list</Link></small>
                </header>
                <div>
                    <Table bordered>
                        <thead>
                        <tr>
                            <th>Field</th>
                            <th>Info</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.rows}
                        </tbody>
                    </Table>
                </div>
            </BlockUi>
        );
    }
}

export default StarWarsView;