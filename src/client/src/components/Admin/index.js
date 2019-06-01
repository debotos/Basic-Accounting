import React, { Component } from 'react'
import { Form, Button, Layout, InputNumber, Spin, message } from 'antd'
import axios from 'axios'

const { Content } = Layout
const formItemLayout = {
	labelCol: { span: 6 },
	wrapperCol: { span: 8 }
}
const formTailLayout = {
	labelCol: { span: 6 },
	wrapperCol: { span: 8, offset: 6 }
}
function hasErrors(fieldsError) {
	return Object.keys(fieldsError).some(field => fieldsError[field])
}

export class Admin extends Component {
	componentDidMount() {
		this.getBudget()
		// To disabled submit button at the beginning.
		this.props.form.validateFields()
	}

	getBudget = async () => {
		try {
			this.setState({ loading: true })
			const response = await axios.get('/api/v1/budget')
			console.log('Budget got from server ', response.data)
			this.setState({ data: response.data }, () => this.setState({ loading: false }))
		} catch (error) {
			console.log(error)
			message.error('Failed to load the Budget Data!')
		}
	}

	state = { working: false, loading: true, data: [] }

	handleSubmit = e => {
		e.preventDefault()
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.setState({ working: true })
				console.log('Received values of Admin form: ', values)
				axios
					.post('/api/v1/budget', values)
					.then(response => {
						const data = response.data
						console.log('Budget form submit response: ', data)
						/* Instant UI update */

						this.setState({ working: false })
						message.success('Budget Updated Successfully!')
						this.props.form.validateFields()
					})
					.catch(error => {
						console.log(error.message)
						message.error('Failed to Updated Budget!')
						this.setState({ working: false })
					})
			}
		})
	}

	render() {
		const { working, loading, data } = this.state
		const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form
		const salaryError = isFieldTouched('salary') && getFieldError('salary')
		const consultantError = isFieldTouched('consultant') && getFieldError('consultant')
		const fringeError = isFieldTouched('fringe') && getFieldError('fringe')
		const otherError = isFieldTouched('other') && getFieldError('other')
		const supplyError = isFieldTouched('supply') && getFieldError('supply')
		const travelError = isFieldTouched('travel') && getFieldError('travel')

		if (loading) return <Spin size="large" />
		const { consultant, fringe, other, salary, supply, travel } = data
		return (
			<>
				<Layout style={{ padding: '24px 0', margin: '50px 0', background: '#fff' }}>
					<Content style={{ padding: '0 24px', minHeight: 280 }}>
						<Form layout="horizontal" onSubmit={this.handleSubmit}>
							<Form.Item
								label="Salaries And Wages Budget"
								validateStatus={salaryError ? 'error' : ''}
								help={salaryError || ''}
								{...formItemLayout}
							>
								{getFieldDecorator('salary', {
									initialValue: salary,
									rules: [{ required: true, message: 'Provide Salaries And Wages Budget!' }]
								})(
									<InputNumber
										style={{ minWidth: '200px' }}
										formatter={value => `৳ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
										parser={value => value.replace(/৳\s?|(,*)/g, '')}
										min={0}
									/>
								)}
							</Form.Item>
							<Form.Item
								label="Fringe Budget"
								validateStatus={fringeError ? 'error' : ''}
								help={fringeError || ''}
								{...formItemLayout}
							>
								{getFieldDecorator('fringe', {
									initialValue: fringe,
									rules: [{ required: true, message: 'Provide Fringe Budget!' }]
								})(
									<InputNumber
										style={{ minWidth: '200px' }}
										formatter={value => `৳ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
										parser={value => value.replace(/৳\s?|(,*)/g, '')}
										min={0}
									/>
								)}
							</Form.Item>
							<Form.Item
								label="Consultant Budget"
								validateStatus={consultantError ? 'error' : ''}
								help={consultantError || ''}
								{...formItemLayout}
							>
								{getFieldDecorator('consultant', {
									initialValue: consultant,
									rules: [{ required: true, message: 'Provide Consultant Budget!' }]
								})(
									<InputNumber
										style={{ minWidth: '200px' }}
										formatter={value => `৳ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
										parser={value => value.replace(/৳\s?|(,*)/g, '')}
										min={0}
									/>
								)}
							</Form.Item>
							<Form.Item
								label="Supplies Budget"
								validateStatus={supplyError ? 'error' : ''}
								help={supplyError || ''}
								{...formItemLayout}
							>
								{getFieldDecorator('supply', {
									initialValue: supply,
									rules: [{ required: true, message: 'Provide Supplies Budget!' }]
								})(
									<InputNumber
										style={{ minWidth: '200px' }}
										formatter={value => `৳ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
										parser={value => value.replace(/৳\s?|(,*)/g, '')}
										min={0}
									/>
								)}
							</Form.Item>
							<Form.Item
								label="Travel Budget"
								validateStatus={travelError ? 'error' : ''}
								help={travelError || ''}
								{...formItemLayout}
							>
								{getFieldDecorator('travel', {
									initialValue: travel,
									rules: [{ required: true, message: 'Provide Travel Budget!' }]
								})(
									<InputNumber
										style={{ minWidth: '200px' }}
										formatter={value => `৳ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
										parser={value => value.replace(/৳\s?|(,*)/g, '')}
										min={0}
									/>
								)}
							</Form.Item>
							<Form.Item
								label="Others Budget"
								validateStatus={otherError ? 'error' : ''}
								help={otherError || ''}
								{...formItemLayout}
							>
								{getFieldDecorator('other', {
									initialValue: other,
									rules: [{ required: true, message: 'Provide Others Budget!' }]
								})(
									<InputNumber
										style={{ minWidth: '200px' }}
										formatter={value => `৳ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
										parser={value => value.replace(/৳\s?|(,*)/g, '')}
										min={0}
									/>
								)}
							</Form.Item>

							<Form.Item {...formTailLayout}>
								<Button
									loading={working}
									type="primary"
									htmlType="submit"
									disabled={hasErrors(getFieldsError())}
								>
									Save
								</Button>
							</Form.Item>
						</Form>
					</Content>
				</Layout>
			</>
		)
	}
}

const AdminForm = Form.create({ name: 'admin_form' })(Admin)

export default AdminForm
