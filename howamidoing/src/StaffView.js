import React from "react";
import "react-select2-wrapper/css/select2.css";

import { Row, Col } from "react-bootstrap";
import StudentTargetSelector from "./StudentTargetSelector.js";
import UploadTargets from "./UploadTargets.js";
import AssignmentDetails from "./AssignmentDetails.js";
import ConfigEditor from "./ConfigEditor.js";

export default function StaffView({ students, onSubmit }) {
  if (window.location.toString().includes("histogram")) {
    return <AssignmentDetails assignment="Labs" onLogin={onSubmit} />;
  }
  if (window.location.toString().endsWith("edit")) {
    return <ConfigEditor />;
  }
  return (
    <div>
      <Row>
        <Col>
          <StudentTargetSelector students={students} onSubmit={onSubmit} />
        </Col>
      </Row>
      <UploadTargets />
    </div>
  );
}
