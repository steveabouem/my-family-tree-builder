import React, {useState} from "react";
import {Container} from "react-bootstrap";
import {TopNav} from "./TopNav";

export const Page = ({children}) => {
    const [loading, setLoading] = useState(false);

    return (
        <>
            <TopNav />
            <Container fluid>
                {children}
            </Container>
        </>
);
}
