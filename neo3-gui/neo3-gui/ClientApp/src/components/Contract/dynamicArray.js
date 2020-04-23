import React from 'react';
import 'antd/dist/antd.css';
import axios from 'axios';

import { Form, Input, Button,Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';


const {Option} = Select;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};

const prefixSelector = (
  <Form.Item noStyle>
    <Select style={{ width: 70 }}>
      <Option value="86">+86</Option>
      <Option value="87">+87</Option>
    </Select>
  </Form.Item>
);
const typeOption = [
"Signature",
"Boolean",
"Integer",
"Hash160",
"Hash256",
"ByteArray",
"PublicKey",
"String",
"Array"
]
class DynamicArray extends React.Component{
  handleparam = values => {
    console.log(values)
    this.props.handleparam(values);
  }
  render = () =>{
    return (
        <Form name="dynamic_form" {...formItemLayoutWithOutLabel} onFinish={this.handleparam}>
          <Form.List name="arrays">
            {(fields, { add, remove }) => {
              console.log(fields)
              return (
                <div>
                  {fields.map((field, index) => (
                    <div key={field.key}>
                      {/* <Form.Item
                        {...field}
                        label="Type"
                        key={"type"+field.key}
                        rules={[
                          {
                            required: true,
                            message: "qqqq",
                          },
                        ]}
                      >
                        <Select placeholder="type选择">
                            {typeOption.map((item)=>{
                              return(
                              <Option key={item}>{item}</Option>
                              )
                            })}
                        </Select>
                      </Form.Item> */}
                      <Form.Item
                        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                        label={index === 0 ? 'Passengers' : ''}
                        required={false}
                        key={field.key}
                      >
                        {/* <Form.Item
                          {...field}
                          validateTrigger={['onChange', 'onBlur']}
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message: "Please input passenger's name or delete this field.",
                            },
                          ]}
                          noStyle
                        >
                          <Input placeholder="passenger name" style={{ width: '60%' }} />
                        </Form.Item> */}
                        <Form.Item
                          label="Phone Number"
                          rules={[{ required: true, message: 'Please input your phone number!' }]}
                        >
                          <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
                        </Form.Item>
                        {fields.length > 1 ? (
                          <MinusCircleOutlined
                            className="dynamic-delete-button"
                            style={{ margin: '0 8px' }}
                            onClick={() => {
                              remove(field.name);
                            }}
                          />
                        ) : null}
                      </Form.Item>
                    </div>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => {
                        add();
                      }}
                      style={{ width: '60%' }}
                    >
                      <PlusOutlined /> Add field
                    </Button>
                  </Form.Item>
                </div>
              );
            }}
          </Form.List>
    
          <Form.Item>
            <Button type="primary" htmlType="submit">
              构造
            </Button>
          </Form.Item>
        </Form>
        );
    }
} 


export default DynamicArray;