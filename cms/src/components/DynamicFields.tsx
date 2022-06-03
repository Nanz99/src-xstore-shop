import React, { Component, Fragment } from 'react'
import { Form, Icon, Button, Row, Col } from 'antd'
// import PropTypes from "prop-types";
// import I18n from "i18n-js";

class DynamicFields extends Component {
  item = 1

  add = () => {
    const { getFieldValue, setFieldsValue, name } = this.props,
      keys = getFieldValue(`${name}List`),
      nextKeys = keys.concat(this.item++)

    setFieldsValue({
      [`${name}List`]: nextKeys,
    })
  }

  remove = k => () => {
    const { getFieldValue, setFieldsValue, name } = this.props,
      keys = getFieldValue(`${name}List`)

    if (keys.length === 1) return
    setFieldsValue({
      [`${name}List`]: keys.filter(key => key !== k),
    })
  }

  refresh = () => {
    this.item = 1
    const { setFieldsValue, name } = this.props

    // Remove all fields then add default field again
    setFieldsValue({
      [`${name}List`]: [],
      [`${name}List`]: [0],
    })
  }

  defaultValidation = required => ({
    validateTrigger: ['onChange', 'onBlur'],
    rules: [
      {
        required: required && typeof required === 'boolean' ? required : false,
        // message: I18n.t("messages.required_field")
        message: 'Không được để trống',
      },
    ],
  })

  addSingleField = () => {
    const { getFieldDecorator, getFieldValue, fields: obj, name } = this.props
    getFieldDecorator(`${name}List`, { initialValue: [0] })
    const fieldCounter = getFieldValue(`${name}List`)
    return fieldCounter.map(k => (
      <Form.Item key={k}>
        {getFieldDecorator(
          `${name}[${k}]`,
          obj.validation || this.defaultValidation(obj.required),
        )(obj.field())}
        {fieldCounter.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={this.remove(k)}
          />
        ) : null}
      </Form.Item>
    ))
  }

  addMultipleFields = () => {
    const { getFieldDecorator, getFieldValue, fields, name } = this.props
    getFieldDecorator(`${name}List`, { initialValue: [0] })
    const fieldCounter = getFieldValue(`${name}List`)

    const handleAddLabel = (obj, k) => {
      if (obj.label && typeof obj.label === 'string') {
        if (obj.showIdentity && typeof obj.showIdentity === 'boolean') {
          return `${obj.label} ${k == 0 ? '' : k}`
        }
        return obj.label
      }
      return null
    }

    return fieldCounter.reduce((preResult, k) => {
      const row = fields.map((obj, i) => (
        <Form.Item label={`${handleAddLabel(obj, k)}`} key={`${k}${obj.name}`}>
          {getFieldDecorator(
            `${name}[${k}][${obj.name}]`,
            obj.validation || this.defaultValidation(obj.required),
          )(obj.field())}
          {fieldCounter.length > 1 && fields.length - 1 !== i ? (
            <Button
              style={{ marginLeft: 16 }}
              icon="delete"
              onClick={this.remove(k)}
            />
          ) : null}
        </Form.Item>
      ))

      return [...preResult, ...row]
    }, [])
  }

  render() {
    const { fields, name, description } = this.props
    console.log(
      '🚀 ~ file: DynamicFields.tsx ~ line 110 ~ DynamicFields ~ render ~ props',
      this.props,
    )
    console.log(
      '🚀 ~ file: DynamicFields.tsx ~ line 113 ~ DynamicFields ~ render ~ description',
      description,
    )
    console.log(
      '🚀 ~ file: DynamicFields.tsx ~ line 113 ~ DynamicFields ~ render ~ name',
      name,
    )
    console.log(
      '🚀 ~ file: DynamicFields.tsx ~ line 113 ~ DynamicFields ~ render ~ fields',
      fields,
    )
    return (
      <Fragment>
        {/* {Array.isArray(fields)
          ? this.addMultipleFields()
          : this.addSingleField()} */}
        {Array.isArray(fields) ? <p>Nhieu field</p> : <p> Co 1 field thoi a</p>}
        <Row>
          <Col xs={24} sm={24} md={8} lg={8}>
            {/* Label is empty for add button */}
          </Col>
          <Col xs={24} sm={24} md={16} lg={16}>
            <Form.Item>
              <Button
                key={'button add'}
                type="dashed"
                onClick={this.add}
                style={{ width: '60%' }}
              >
                <Icon type="plus" /> Add{' '}
                {description && typeof description === 'string'
                  ? description
                  : ''}
              </Button>
              <Button
                key={'button refresh'}
                type="dashed"
                onClick={this.refresh}
                style={{ width: '36%', marginLeft: '8px' }}
              >
                <Icon type="undo" /> Refresh
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Fragment>
    )
  }
}

// DynamicFields.propTypes = {
//   name: PropTypes.string.isRequired,
//   fields: PropTypes.oneOfType([
//     PropTypes.object,
//     PropTypes.arrayOf(PropTypes.object)
//     //TODO: add object shape validation.
//   ]).isRequired,
//   getFieldValue: PropTypes.func.isRequired,
//   setFieldsValue: PropTypes.func.isRequired
// };

export default DynamicFields
