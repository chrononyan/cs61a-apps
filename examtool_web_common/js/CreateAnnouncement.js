import React, { useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import FailText from "./FailText";
import LoadingButton from "./LoadingButton";

export default function CreateAnnouncement({ staffData, send }) {
  const [message, setMessage] = useState("");
  const [overrideMessage, setOverrideMessage] = useState(false);
  const [audioMessage, setAudioMessage] = useState("");
  const [question, setQuestion] = useState("Overall Exam");
  const [referencePoint, setReferencePoint] = useState("immediate");
  const [offset, setOffset] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [failText, setFailText] = useState("");

  const submit = async () => {
    setIsLoading(true);
    const err = await send("add_announcement", {
      announcement: {
        type: referencePoint === "immediate" ? "immediate" : "scheduled",
        canonical_question_name: question === "Overall Exam" ? null : question,
        base: referencePoint,
        offset: Number.parseInt(offset, 10),
        spoken_message: overrideMessage ? audioMessage.trim() : undefined,
        message,
      },
    });
    if (err) {
      setFailText(err);
    }
    setIsLoading(false);
  };

  return (
    <>
      <Row>
        <Col>
          <Card>
            <Card.Header>Create Announcement</Card.Header>
            <Card.Body>
              <Form>
                <Form.Group>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={message}
                    placeholder="Broadcast a message to all students in this exam."
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </Form.Group>
                {overrideMessage ? (
                  <Form.Group>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={audioMessage}
                      placeholder="Override the associated spoken audio message."
                      onChange={(e) => setAudioMessage(e.target.value)}
                    />
                  </Form.Group>
                ) : null}
                <Form.Group>
                  <Form.Control
                    as="select"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    custom
                  >
                    <option value={null}>Overall Exam</option>
                    {staffData.exam.questions.map(
                      ({ canonical_question_name: questionName }) => (
                        <option key={questionName}>{questionName}</option>
                      )
                    )}
                  </Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Control
                    as="select"
                    value={referencePoint}
                    onChange={(e) => setReferencePoint(e.target.value)}
                    custom
                  >
                    <option value="immediate">Immediately</option>
                    <option value="start">Relative to start</option>
                    <option value="end">Relative to end</option>
                  </Form.Control>
                </Form.Group>
                {referencePoint !== "immediate" && (
                  <Form.Group>
                    <Form.Control
                      type="number"
                      placeholder="Offset from reference (seconds)"
                      value={offset}
                      onChange={(e) => setOffset(e.target.value)}
                    />
                  </Form.Group>
                )}
                <Form.Group>
                  <Form.Check
                    custom
                    checked={overrideMessage}
                    name={question.id}
                    type="checkbox"
                    label="Override audio message"
                    id="audioOverrideCheckbox"
                    onChange={(e) => setOverrideMessage(e.target.checked)}
                  />
                </Form.Group>
                <Form.Group>
                  <LoadingButton
                    loading={isLoading}
                    disabled={
                      isLoading ||
                      (offset == null && referencePoint !== "immediate")
                    }
                    onClick={submit}
                  >
                    Send
                  </LoadingButton>
                  <FailText text={failText} suffixType="alerts" />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <br />
    </>
  );
}
