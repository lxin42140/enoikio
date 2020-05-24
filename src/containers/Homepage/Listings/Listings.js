import React, { Component } from 'react';
import Listing from './Listing/Listing';
// import axios from 'axios';
// import classes from './Listing/Listing.css';
//import img1 from './../assets/img1.jpg'
import { Link } from 'react-router-dom';

class Listings extends Component {

    //dummy data for testing design
    //pass all these as props from database
    state = {
        listings: [{
            name: 'John',
            module: 'CS2030',
            textbook: 'Introduction to CS2030',
            collectionMethod: 'Meet up',
            location: '',
            rentPrice: '$2.30',
            postTime: '',
            image: require("../../../assets/images/img1.jpg"),
            ratings: '',
            otherInformation: ''
        }, {
            name: 'Johnny',
            module: 'CS2040',
            textbook: 'Introduction to CS2040',
            collectionMethod: 'Meet up',
            location: '',
            rentPrice: '$2.40',
            postTime: '',
            image: require("../../../assets/images/img1.jpg"),
            ratings: '',
            otherInformation: ''
        }],
        clicked: false

    }

    //need to add key in each data
    // data = {
    //     username:
    //     module:
    //     textbook:
    //     image: 
    //     location:
    //     rentPrice:
    //     postTime:
    //     ratings:
    // }

    // componentDidMount() {
    //     axios.get('/listing.json')
    //         .then(response => {
    //             const listings = [];
    //             for (let key in response.data) {
    //                 listings.push({ ...response.data[key], id: key });
    //             };
    //             this.setState({ listings: listings });
    //         })
    // }

    render() {

        return (
            <div>
                {this.state.listings.map(listing => {
                    const data = { ...listing }
                    return (
                        // <Link to={"/listings/"+ listing.textbook} key={listing.name}>
                        <Listing
                            info={data}
                            key={listing.name} />
                        // </Link>
                    )
                })}
            </div>
        );
    }
}

export default Listings;