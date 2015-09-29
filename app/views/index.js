'use strict';
import React from '../lib/react';
import {Layout} from './_layout';
import {homeActions as actions} from '../actions/homeActions';
import {homeStore as store} from '../stores/homeStore';


export class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = store.getData();

        this.storeChanged = this.storeChanged.bind(this);

        store.addChangeListener(this.storeChanged);
    }
    componentDidMount() {
        actions.loadCohort();
    }
    storeChanged(){
        this.setState(store.getData());
    }
    componentWillUnmount() {
        store.removeChangeListener(this.storeChanged);
    }
    render() {
        var rows = [],
        data = this.state.data.rows;
        for(var i = 0; i<data.length; i++){
            rows.push(<TableRow data={data[i]} key={i} />);
        }
        return (
                <div className="container" style={{'marginTop': '100px'}}>
                    <section className="row">
                        <h1 className="twelve columns">Cohort Analysis</h1>
                        <div className="twelve columns">
                        {this.state.loadingData ?
                            <h6>Loading...</h6>
                            :
                            <table>
                                <thead>
                                    <tr>
                                        <th>Cohort</th>
                                        <th>Customers</th>
                                        <th>0-6 days</th>
                                        <th>7-13 days</th>
                                        <th>14-20 days</th>
                                        <th>21-27 days</th>
                                        <th>28-34 days</th>
                                        <th>35-41 days</th>
                                        <th>42-48 days</th>
                                        <th>49-55 days</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows}
                                </tbody>
                            </table>
                        }
                        </div>
                    </section>
                </div>
        );
    }
};
Home.title = 'Cohort Builder';

export class TableRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render(){
        var d = this.props.data,
            columns = [];
        for(var i = 0; i < d.relative_weeks.length; i++){
            columns.push(
                <td key={i}>
                    <p>{d.relative_weeks[i] ? (d.relative_weeks[i].num_orders / d.total_customers).toFixed(2) + '% orderers (' + d.relative_weeks[i].num_orders + ')' : null}</p>
                    <p>{d.relative_weeks[i] ? (d.relative_weeks[i].num_firsts / d.total_customers).toFixed(2) + '% 1st time (' + d.relative_weeks[i].num_firsts + ')' : null}</p>
                </td>);
        }
        return(
            <tr>
                <td>{d.week_label}</td>
                <td>{d.total_customers}</td>
                {columns}
            </tr>
        );
    }
}


// <td>
//                     <p>{(d[1].num_orders / d.total_customers).toFixed(2) + '% orderers (' + d[1].num_orders + ')'}</p>
//                     <p>{(d[1].num_firsts / d.total_customers).toFixed(2) + '% orderers (' + d[1].num_firsts + ')'}</p>
//                 </td>
//                 <td>
//                     <p>{d[2] ? (d[2].num_orders / d.total_customers).toFixed(2) + '% orderers (' + d[2].num_orders + ')' : null}</p>
//                     <p>{d[2] ? (d[2].num_firsts / d.total_customers).toFixed(2) + '% 1st time (' + d[2].num_firsts + ')' : null}</p>
//                 </td>
//                 <td>
//                     <p>{d[3] ? (d[3].num_orders / d.total_customers).toFixed(2) + '% orderers (' + d[3].num_orders + ')' : null}</p>
//                     <p>{d[3] ? (d[3].num_firsts / d.total_customers).toFixed(2) + '% 1st time (' + d[3].num_firsts + ')' : null}</p>
//                 </td>
//                 <td>
//                     <p>{d[4] ? (d[4].num_orders / d.total_customers).toFixed(2) + '% orderers (' + d[4].num_orders + ')' : null}</p>
//                     <p>{d[4] ? (d[4].num_firsts / d.total_customers).toFixed(2) + '% 1st time (' + d[4].num_firsts + ')' : null}</p>
//                 </td>
//                 <td>
//                     <p>{d[5] ? (d[5].num_orders / d.total_customers).toFixed(2) + '% orderers (' + d[5].num_orders + ')' : null}</p>
//                     <p>{d[5] ? (d[5].num_firsts / d.total_customers).toFixed(2) + '% 1st time (' + d[5].num_firsts + ')' : null}</p>
//                 </td>
//                 <td>
//                     <p>{d[6] ? (d[6].num_orders / d.total_customers).toFixed(2) + '% orderers (' + d[6].num_orders + ')' : null}</p>
//                     <p>{d[6] ? (d[6].num_firsts / d.total_customers).toFixed(2) + '% 1st time (' + d[6].num_firsts + ')' : null}</p>
//                 </td>
//                 <td>
//                     <p>{d[7] ? (d[7].num_orders / d.total_customers).toFixed(2) + '% orderers (' + d[7].num_orders + ')' : null}</p>
//                     <p>{d[7] ? (d[7].num_firsts / d.total_customers).toFixed(2) + '% 1st time (' + d[7].num_firsts + ')' : null}</p>
//                 </td>
//                 <td>
//                     <p>{d[8] ? (d[8].num_orders / d.total_customers).toFixed(2) + '% orderers (' + d[8].num_orders + ')' : null}</p>
//                     <p>{d[8] ? (d[8].num_firsts / d.total_customers).toFixed(2) + '% 1st time (' + d[8].num_firsts + ')' : null}</p>
//                 </td>