import React from "react";
import {Container} from "react-bootstrap";
import TopNav from "./TopNav";
import {connect} from "react-redux";

const Page = ({children}) => {

    return (
        <>
            <TopNav />
            <Container fluid>
                {children}
            </Container>
        </>
);
}

const mapStateToProps = (state) => ({
    isLoading: state.isLoading,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Page);