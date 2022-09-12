import React from "react";
import {Container} from "react-bootstrap";
import TopNav from "./TopNav";
import {connect} from "react-redux";
import Spinner from "./spinner";

const Page = ({children, isLoading}) => {

    return (


        <div>
            {/*<TopNav />*/}
            <Container fluid>
                {isLoading && <Spinner/>}
                {children}
            </Container>
        </div>
    );
}

const mapStateToProps = ({app}) => ({
    isLoading: app.isLoading,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Page);