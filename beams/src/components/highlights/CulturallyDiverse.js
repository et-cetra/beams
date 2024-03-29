import React from 'react';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import FaceIcon from '@material-ui/icons/Face';

class CulturallyDiverse extends React.Component {
    state = {
        isCulturallyDiverse: false
    };

    // If top country of birth is < 50% give tag 'Culturally Diverse'

    async isCulturallyDiverse() {
        const suburbInfo = this.props.stats;
        var cobArray = suburbInfo.demographics[1].items;
        if (cobArray.length < 5) {
            return false;
        }
        const total = cobArray[0].value + cobArray[1].value + cobArray[2].value + cobArray[3].value + cobArray[4].value;
        if ((cobArray[0].value / total) <= 0.5) {
            return true;
        } else {
            return false;
        }
    }

    async componentDidMount() {
        const result = await this.isCulturallyDiverse();
        this.setState({
            isCulturallyDiverse: result
        });
    }

    render() {
        if (this.state.isCulturallyDiverse) {
            return (
                <Chip avatar={<Avatar><FaceIcon /></Avatar>} label="Culturally Diverse"
                    className="ChipsHighlight" color={this.props.compareColor} />
            );
        } else {
            return (
                <div></div>
            )
        }
    }
}

export default CulturallyDiverse;
