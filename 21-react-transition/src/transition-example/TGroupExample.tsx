import React, { useState } from "react";
import { Container, ListGroup, Button } from "react-bootstrap";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import "./styles/TGroup.css";

function TodoList() {
  const [items, setItems] = useState([
    { id: "1234", text: "Buy eggs" },
    { id: "4567", text: "Pay bills" },
    { id: "7890", text: "Invite friends over" },
    { id: "0123", text: "Fix the TV" },
  ]);
  return (
    <Container style={{ marginTop: "2rem" }}>
      <ListGroup style={{ marginBottom: "1rem" }}>
        <TransitionGroup className="todo-list">
          {items.map(({ id, text }) => (
            <CSSTransition key={id} timeout={500} classNames="item">
              <ListGroup.Item>
                <Button
                  className="remove-btn"
                  variant="danger"
                  size="sm"
                  onClick={() =>
                    setItems((items) => items.filter((item) => item.id !== id))
                  }
                >
                  &times;
                </Button>
                {text}
              </ListGroup.Item>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </ListGroup>
      <Button
        onClick={() => {
          const text = prompt("Enter some text");
          if (text) {
            setItems((items) => [
              ...items,
              { id: `${Math.round(Math.random() * 1000)}`, text },
            ]);
          }
        }}
      >
        Add Item
      </Button>
    </Container>
  );
}

export default TodoList;
