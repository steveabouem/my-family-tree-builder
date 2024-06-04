import React from "react";
import { DFamilyTree } from "../tree/definitions";
import { Col, Container, Row } from "react-bootstrap";

const FamilyCard = (props: Partial<DFamilyTree>): JSX.Element => {
  return (
    <Container>
      <Row>
        <Col>
          <h3>{props.name} Family Tree</h3>
        </Col>
      </Row>
      {}
      <Row>

      </Row>
    </Container>
  );
};

export default FamilyCard;
