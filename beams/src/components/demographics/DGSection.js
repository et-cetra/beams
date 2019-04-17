import React from 'react';
import '../../pages/SuburbPage.css'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Grid, Paper, CircularProgress, Fade, Chip } from '@material-ui/core';

class DGSection extends React.Component {
    
    getLegend = (value, entry, index) => {
      const COLORS = this.props.COLORS;
      //if(index >= this.props.chartData.length) return;
      //else 
        return <Chip variant="outlined" label={value} color="default"
          style={{color: COLORS[index], marginTop: "3px", marginBottom: "3px"}}/>;
    }

    singlePie = (chartData, COLORS) => {
      return(
        <ResponsiveContainer height={400} width="100%">
        <PieChart className="PieChart" onMouseEnter={this.onPieEnter}>
            <Pie data={chartData} innerRadius="55%" outerRadius="72%" cx="50%"  
            isAnimationActive={false} fill="#8884d8" paddingAngle={4}
            dataKey="value" label={this.renderCustomizedLabel} labelLine={false}>
            {chartData.map((entry, index) =>
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
            )}
            </Pie>
            <Legend align="center" layout="horizontal" formatter={this.getLegend}
            verticalAlign="bottom" iconSize={0}/>
            <Tooltip/>
        </PieChart>
        </ResponsiveContainer>
      );
    }

    multiPie = (chartData, COLORS, suburbs) => {
      return(
        <div style={{width: "100%"}}>
        <div className="CompareDGText">
            <Chip className="CompareDGTextL" color="primary" label={suburbs[0].suburb}/>
            <Chip className="CompareDGTextR" color="secondary" label={suburbs[1].suburb}/>
        </div>
        <ResponsiveContainer height={375} width="100%">
          <PieChart className="PieChart" onMouseEnter={this.onPieEnter}>
            <Pie data={chartData} innerRadius="55%" outerRadius="72%" cx="55%" cy={120}
            isAnimationActive={false} fill="#8884d8" paddingAngle={4}
            dataKey="value" label={this.renderCustomizedLabel} labelLine={false}
            startAngle={90} endAngle={-90}>
            {chartData.map((_entry, index) =>
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
            )}
            </Pie>
            <Pie data={chartData} innerRadius="55%" outerRadius="72%" cx="45%" cy={120}
              isAnimationActive={false} fill="#8884d8" paddingAngle={4}
              dataKey="value2" label={this.renderCustomizedLabel} labelLine={false}
              startAngle={90} endAngle={270}>
              {chartData.map((_entry, index) =>
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
              )}
            </Pie>
            <Tooltip/>
            <Legend align="center" layout="horizontal" formatter={this.getLegend}
            verticalAlign="bottom" iconSize={0}/>
          </PieChart>          
        </ResponsiveContainer>
        </div>
      );
    }

    renderCustomizedLabel = ({
      cx, cy, midAngle, innerRadius, outerRadius, percent, index,
    }) => {

      const COLORS = this.props.COLORS;
      const RADIAN = Math.PI / 180;
      var radius = innerRadius + (outerRadius - innerRadius) * 1.5;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
      return (
        <text x={x} y={y} fill={COLORS[index % COLORS.length]} 
        textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    }

    render() {
      const COLORS = this.props.COLORS;
      const chartData = this.props.chartData;
      const isCompare = this.props.isCompare;
      const suburbs = this.props.suburbs;
      var itemSize = 7;
      if(isCompare) itemSize = 12;

      if(this.props.loading){
        return (
          <div className="DGTab">
            <Paper square>
            <Grid className="DGGridContainer" container spacing={0} direction="row"
            justify="center" alignItems="stretch">
              <Grid item xs={itemSize}><CircularProgress size={60} color="secondary"/></Grid>
            </Grid>
            </Paper>
          </div>
        );
      }
      else{
        return (
          <div className="DGTab">
            <Paper square>
            <Grid className="DGGridContainer" container spacing={0} direction="row"
            justify="center" alignItems="stretch">
            <Fade in timeout={600}>
            <Grid item xs={itemSize}>

              {isCompare ? this.multiPie(chartData, COLORS, suburbs) 
                : this.singlePie(chartData, COLORS)}

            </Grid>
            </Fade>
            <Fade in timeout={600}>

            {!isCompare ?
              <Grid item xs={5} className="DGInfoContainer">
              <br/><br/>
              info goes here (no css yet)
              </Grid>
              :
              <Grid item xs={3}/>
            }
            </Fade>
            </Grid>
            </Paper>
          </div>
      );
    }
  }
}

export default DGSection;
