import React from 'react';
import '../../pages/SuburbPage.css'
import { getDemographics } from '../../utils.js'
import DGSection from './DGSection';

class AgeGroupOfPop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            contents: []
        };
    }

    async componentDidMount() {
        const suburbInfo = await getDemographics(this.props.suburb, this.props.suburb_state, "AgeGroupOfPopulation");
        this.setState({
            isLoaded: true,
            contents: suburbInfo.demographics
        });
    }

    render() {
        const { error, isLoaded, contents } = this.state;
        const COLORS = this.props.COLORS;

        var chartData = [];
        contents.map(content => (content.items.map((item) => (
            chartData.push({name: item.label, value: item.value})
        ))));

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return (
            <div>
                <DGSection loading={1} COLORS={COLORS} chartData={[]}/>
            </div>
            );
        } else {
            return (
            <div>
                <DGSection loading={0} COLORS={COLORS} chartData={chartData}/>
            </div>
            );
        }
    }
}

export default AgeGroupOfPop;