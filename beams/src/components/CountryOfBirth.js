import React from 'react';
import '../App.css';
import {getDemographics} from '../utils.js'
import { PieChart, Pie, Sector, Cell, Tooltip, Legend } from 'recharts';

class CountryOfBirth extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            contents: []
        };
    }

    async componentDidMount() {
        const suburbInfo = await getDemographics(this.props.suburb, this.props.suburb_state, "CountryOfBirth");
        this.setState({
            isLoaded: true,
            contents: suburbInfo.demographics
        });

    }

    render() {
        const { error, isLoaded, contents } = this.state;
        const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#000000', '#000000'];
        const chartData = [];
        contents.map(content => (content.items.slice(0,5).map((item, i) => (
            chartData.push({name: item.label, value: item.value, color: COLORS[i]})
        ))));

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
            <div>

            <PieChart width={280} height={240}
            className="PieChart" onMouseEnter={this.onPieEnter}>
                <Pie data={chartData} innerRadius={60} outerRadius={80}
                fill="#8884d8" paddingAngle={4} dataKey="value" label>
                {chartData.map((entry, index) =>
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                )}
                </Pie>
                <Tooltip/>
            </PieChart>
                    <b>Birth Country:</b>
                    {contents.map(
                        content => (
                            content.items.slice(0,5).map((item, i) => (
                                <li key={`item-${i}`}>
                                    <b>{item.label}:</b> {item.value}
                        </li>))
                        ))
                    }
                </div>
            );
        }
    }
}

export default CountryOfBirth;
