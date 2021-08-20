import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  Form,
  Input,
  Divider,
  Button,
  List,
  Steps,
  Typography,
  Badge,
  notification,
  Space,
  Col,
  Row
} from "antd";
import { SmileTwoTone, LikeTwoTone, CheckCircleTwoTone, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Address } from "../components";
const { Title } = Typography;

export default function QuadraticDiplomacyCreate({ tx, writeContracts }) {
  const [voters, setVoters] = useState([{}]);
  const [voteAllocation, setVoteAllocation] = useState(0);
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    const names = [];
    const wallets = [];

    voters.forEach(({ name, address }) => {
      names.push(name);
      wallets.push(address);
    });

    await tx(writeContracts.QuadraticDiplomacyContract.addMembersWithVotes(names, wallets, voteAllocation), update => {
      if (update && (update.status === "confirmed" || update.status === 1)) {
        setVoters([{}]);
        setVoteAllocation(0);
        form.resetFields();
      }
    });
  };

  return (
    <div class="custom-wrapper">
      <Title level={3} style={{ fontFamily: "Space Mono" }}>Add members</Title>
      <Divider />
      <Form form={form} name="basic" onFinish={handleSubmit} labelCol={{ span: 8 }} wrapperCol={{ span: 24 }} layout="vertical">
        <Form.Item label="Vote Allocation" name="voteCredit" style={{ textAlign: "left" }}>
          <Col span = {8}>
          <Input
            type="number"
            placeholder="Voter Allocation"
            onChange={event => setVoteAllocation(event.target.value)}
          />
          </Col>
        </Form.Item>
        <Divider />
        {voters.map((_, index) => (
          <VoterInput key={index} index={index} setVoters={setVoters} />
        ))}
        <Form.Item style={{ justifyContent: "center" }}>
          <Button
            type="dashed"
            block
            icon={<PlusOutlined />}
            onClick={() => setVoters(prevVoters => [...prevVoters, {}])}
          >
            Add Voter
          </Button>
        </Form.Item>
        <Divider />
        <Form.Item wrapperCol={{ offset: 16, span: 8 }}>
          <Button type="primary" htmlType="submit" block>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

const VoterInput = ({ index, setVoters }) => {
  return (
    <>
      <Form.Item label="Voter" name={`name[${index}]`} style={{ textAlign: "left"}}>
        <Input.Group size="large">
        <Row gutter={8}>
        <Col span={8}>
        <Input
          placeholder="Name"
          onChange={event =>
            setVoters(prevVoters => {
              const nextVoters = [...prevVoters];
              nextVoters[index].name = event.target.value;
              return nextVoters;
            })
          }
        />
        </Col>
        <Col span={16}>
        <Input
          placeholder="Address"
          onChange={event =>
            setVoters(prevVoters => {
              const nextVoters = [...prevVoters];
              nextVoters[index].address = event.target.value;
              return nextVoters;
            })
          }
        />
        </Col>
        </Row>
        </Input.Group>
      </Form.Item>
    </>
  );
};
