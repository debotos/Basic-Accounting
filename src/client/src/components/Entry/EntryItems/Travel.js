import React, { Component } from 'react'
import {
	Form,
	Input,
	Button,
	DatePicker,
	InputNumber,
	Table,
	Popconfirm,
	Spin,
	message,
	Icon
} from 'antd'
import axios from 'axios'
import moment from 'moment'
import numeral from 'numeral'
import Highlighter from 'react-highlight-words'

function hasErrors(fieldsError) {
	return Object.keys(fieldsError).some(field => fieldsError[field])
}

export class Travels extends Component {
	componentDidMount() {
		this.getTravels()
		// To disabled submit button at the beginning.
		this.props.form.validateFields()
	}

	getTravels = async () => {
		try {
			this.setState({ loading: true })
			const response = await axios.get('/api/v1/travels')
			const data = response.data.map(x => ({ ...x, key: x._id })).reverse()
			this.setState({ data }, () => this.setState({ loading: false }))
		} catch (error) {
			console.log(error)
			message.error('Failed to load the travels data!')
		}
	}

	state = { working: false, loading: true, data: [] }

	updateData = (id, data) => {
		const update = this.state.data.map(x => {
			if (x.key === id) {
				return { ...x, ...data }
			} else {
				return x
			}
		})
		this.setState({ data: update })
	}

	addData = data => {
		const current = this.state.data
		current.unshift({ ...data, key: data._id })
		this.setState({ data: current })
	}
	deleteData = id => {
		const update = this.state.data.filter(x => x.key !== id)
		this.setState({ data: update })
	}

	handleSubmit = e => {
		e.preventDefault()
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.setState({ working: true })
				console.log('Received values of Travels form: ', values)
				const data = {
					voucher: values.voucher,
					date: values.date.valueOf(),
					da: values.da,
					ta: values.ta,
					name: values.name,
					designation: values.designation,
					amount: values.amount
				}
				console.log('Travels form data formated: ', data)
				axios
					.post('/api/v1/travels', data)
					.then(response => {
						const data = response.data
						console.log('Travels form submit response: ', data)
						/* Instant UI update */
						this.addData(data)
						this.setState({ working: false })
						message.success('Added Successfully!')
						// Clear the form
						this.props.form.resetFields()
						// To disabled submit button
						this.props.form.validateFields()
					})
					.catch(error => {
						console.log(error.message)
						message.error('Failed to add!')
						this.setState({ working: false })
					})
			}
		})
	}

	onDateChange = (date, dateString) => {
		console.log(date, dateString)
	}

	render() {
		const { working, loading, data } = this.state
		const {
			getFieldValue,
			setFieldsValue,
			getFieldDecorator,
			getFieldsError,
			getFieldError,
			isFieldTouched
		} = this.props.form
		// Only show error after a field is touched.
		const voucherError = isFieldTouched('voucher') && getFieldError('voucher')
		const dateError = isFieldTouched('date') && getFieldError('date')
		const nameError = isFieldTouched('name') && getFieldError('name')
		const designationError = isFieldTouched('designation') && getFieldError('designation')
		const amountError = isFieldTouched('amount') && getFieldError('amount')
		const daError = isFieldTouched('da') && getFieldError('da')
		const taError = isFieldTouched('ta') && getFieldError('ta')

		return (
			<>
				<Form layout="inline" onSubmit={this.handleSubmit}>
					<Form.Item validateStatus={voucherError ? 'error' : ''} help={voucherError || ''}>
						{getFieldDecorator('voucher', {
							rules: [{ required: true, message: 'Please provide Voucher No.!' }]
						})(<Input placeholder="Voucher No." />)}
					</Form.Item>

					<Form.Item validateStatus={dateError ? 'error' : ''} help={dateError || ''}>
						{getFieldDecorator('date', {
							rules: [{ required: true, message: 'Please provide Date!' }]
						})(<DatePicker placeholder="Select Date" />)}
					</Form.Item>

					<Form.Item validateStatus={daError ? 'error' : ''} help={daError || ''}>
						{getFieldDecorator('da', {
							initialValue: 0,
							rules: [{ required: true, message: 'Provide D.A!' }]
						})(
							<InputNumber
								formatter={value => `৳ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								parser={value => value.replace(/৳\s?|(,*)/g, '')}
								min={0}
								onChange={da => {
									setFieldsValue({ amount: da + getFieldValue('ta') })
								}}
							/>
						)}
					</Form.Item>

					<Form.Item validateStatus={taError ? 'error' : ''} help={taError || ''}>
						{getFieldDecorator('ta', {
							initialValue: 0,
							rules: [{ required: true, message: 'Provide T.A!' }]
						})(
							<InputNumber
								formatter={value => `৳ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								parser={value => value.replace(/৳\s?|(,*)/g, '')}
								min={0}
								onChange={ta => {
									setFieldsValue({ amount: ta + getFieldValue('da') })
								}}
							/>
						)}
					</Form.Item>

					<Form.Item validateStatus={nameError ? 'error' : ''} help={nameError || ''}>
						{getFieldDecorator('name', {
							rules: [{ required: true, message: 'Please provide Name!' }]
						})(<Input placeholder="Name" />)}
					</Form.Item>

					<Form.Item validateStatus={designationError ? 'error' : ''} help={designationError || ''}>
						{getFieldDecorator('designation', {
							rules: [{ required: true, message: 'Provide Designation!' }]
						})(<Input placeholder="Designation" />)}
					</Form.Item>

					<Form.Item validateStatus={amountError ? 'error' : ''} help={amountError || ''}>
						{getFieldDecorator('amount', {
							initialValue: getFieldValue('da') + getFieldValue('ta'),
							rules: [{ required: true, message: 'Provide Amount!' }]
						})(
							<InputNumber
								formatter={value => `৳ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								parser={value => value.replace(/৳\s?|(,*)/g, '')}
								min={0}
							/>
						)}
					</Form.Item>

					<Form.Item>
						<Button
							loading={working}
							type="primary"
							htmlType="submit"
							disabled={hasErrors(getFieldsError())}
						>
							Add
						</Button>
					</Form.Item>
				</Form>
				<br />
				{!loading ? (
					<EditableFormTable
						data={data}
						updateData={this.updateData}
						deleteData={this.deleteData}
					/>
				) : (
					<Spin size="large" />
				)}
			</>
		)
	}
}

const TravelsForm = Form.create({ name: 'travels_form' })(Travels)

export default TravelsForm

/*
	*******************************
	Below code for Generate Table
	*******************************
*/

const EditableContext = React.createContext()

class EditableCell extends React.Component {
	getInput = field => {
		switch (field) {
			case 'amount':
			case 'da':
			case 'ta':
				return (
					<InputNumber
						formatter={value => `৳ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
						parser={value => value.replace(/৳\s?|(,*)/g, '')}
						min={0}
					/>
				)
			case 'date':
				return <DatePicker placeholder="Select Date" />
			default:
				return <Input />
		}
	}

	getInputValue = (record, field) => {
		switch (field) {
			case 'date':
				return moment(record[field])
			default:
				return record[field]
		}
	}

	renderDataView = (children, record, field) => {
		switch (field) {
			case 'date':
				return `${moment(record[field]).format('ddd, MMM Do YY')} (${moment(record[field]).format(
					'DD-MM-YYYY'
				)})`
			case 'amount':
			case 'da':
			case 'ta':
				return `${numeral(record[field]).format('0,0.00')} ৳`
			default:
				return children
		}
	}

	renderCell = ({ getFieldDecorator }) => {
		const { editing, dataIndex, title, record, index, children, ...restProps } = this.props
		return (
			<td {...restProps}>
				{editing ? (
					<Form.Item style={{ margin: 0 }}>
						{getFieldDecorator(dataIndex, {
							rules: [
								{
									required: true,
									message: `Please Input ${title}!`
								}
							],
							initialValue: this.getInputValue(record, dataIndex)
						})(this.getInput(dataIndex))}
					</Form.Item>
				) : (
					this.renderDataView(children, record, dataIndex)
				)}
			</td>
		)
	}

	render() {
		return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
	}
}

class EditableTable extends React.Component {
	constructor(props) {
		super(props)
		this.state = { editingKey: '' }
		this.columns = [
			{
				title: 'Voucher',
				dataIndex: 'voucher',
				width: '10%',
				editable: true,
				...this.getColumnSearchProps('voucher')
			},
			{
				title: 'Date',
				dataIndex: 'date',
				width: '20%',
				editable: true,
				sorter: (a, b) => a.date - b.date
			},
			{
				title: 'D.A',
				dataIndex: 'da',
				width: '10%',
				editable: true,
				// defaultSortOrder: 'descend',
				sorter: (a, b) => a.da - b.da
			},
			{
				title: 'T.A',
				dataIndex: 'ta',
				width: '10%',
				editable: true,
				// defaultSortOrder: 'descend',
				sorter: (a, b) => a.ta - b.ta
			},
			{
				title: 'Name',
				dataIndex: 'name',
				width: '15%',
				editable: true,
				...this.getColumnSearchProps('name')
			},
			{
				title: 'Designation',
				dataIndex: 'designation',
				width: '15%',
				editable: true,
				...this.getColumnSearchProps('designation')
			},
			{
				title: 'Total',
				dataIndex: 'amount',
				width: '10%',
				editable: true,
				// defaultSortOrder: 'descend',
				sorter: (a, b) => a.amount - b.amount
			},
			{
				title: 'operation',
				dataIndex: 'operation',
				render: (text, record) => {
					const { editingKey } = this.state
					const editable = this.isEditing(record)
					return editable ? (
						<span>
							<EditableContext.Consumer>
								{form => (
									<a
										href="javascript:;"
										onClick={() => this.save(form, record.key)}
										style={{ marginRight: 8 }}
									>
										Save
									</a>
								)}
							</EditableContext.Consumer>
							<Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
								<a>Cancel</a>
							</Popconfirm>
						</span>
					) : (
						<span>
							<a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>
								Edit
							</a>
							<Popconfirm
								title="Sure to delete?"
								icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
								onConfirm={() => this.delete(record.key)}
							>
								<a href="javascript:;" style={{ marginLeft: 8, color: '#e26a6a' }}>
									Delete
								</a>
							</Popconfirm>
						</span>
					)
				}
			}
		]
	}

	isEditing = record => record.key === this.state.editingKey

	cancel = () => {
		this.setState({ editingKey: '' })
	}

	delete(key) {
		/* Instant UI update */
		this.props.deleteData(key)
		axios
			.delete(`/api/v1/travels/${key}`)
			.then(response => {
				console.log('Travel delete response ', response.data)
				message.success('Successfully Deleted!')
			})
			.catch(error => {
				console.log(error.message)
				message.error('Failed to delete!')
			})
	}

	save(form, key) {
		form.validateFields((err, row) => {
			if (!err) {
				console.log('Received values of Travels Update form: ', row)
				const data = {
					voucher: row.voucher,
					date: row.date.valueOf(),
					da: row.da,
					ta: row.ta,
					name: row.name,
					designation: row.designation,
					amount: row.amount
				}
				console.log('Travels updated form data formated: ', data)
				/* Instant UI update */
				this.props.updateData(key, data)
				axios
					.post(`/api/v1/travels/${key}`, data)
					.then(response => {
						const data = response.data
						console.log('Travels form update response: ', data)
						// To disabled submit button
						this.props.form.validateFields()
						this.cancel(key)
						message.success('Successfully Updated!')
					})
					.catch(error => {
						console.log(error.message)
						message.error('Failed to update!')
					})
			}
		})
	}

	edit(key) {
		this.setState({ editingKey: key })
	}

	state = {
		searchText: ''
	}

	handleSearch = (selectedKeys, confirm) => {
		confirm()
		this.setState({ searchText: selectedKeys[0] })
	}

	handleReset = clearFilters => {
		clearFilters()
		this.setState({ searchText: '' })
	}

	getColumnSearchProps = dataIndex => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
			<div style={{ padding: 8 }}>
				<Input
					ref={node => {
						this.searchInput = node
					}}
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
					onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
					style={{ width: 188, marginBottom: 8, display: 'block' }}
				/>
				<Button
					type="primary"
					onClick={() => this.handleSearch(selectedKeys, confirm)}
					icon="search"
					size="small"
					style={{ width: 90, marginRight: 8 }}
				>
					Search
				</Button>
				<Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
					Reset
				</Button>
			</div>
		),
		filterIcon: filtered => (
			<Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
		),
		onFilter: (value, record) =>
			record[dataIndex]
				.toString()
				.toLowerCase()
				.includes(value.toLowerCase()),
		onFilterDropdownVisibleChange: visible => {
			if (visible) {
				setTimeout(() => this.searchInput.select())
			}
		},
		render: text => (
			<Highlighter
				highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
				searchWords={[this.state.searchText]}
				autoEscape
				textToHighlight={text.toString()}
			/>
		)
	})

	render() {
		const components = {
			body: {
				cell: EditableCell
			}
		}

		const columns = this.columns.map(col => {
			if (!col.editable) {
				return col
			}
			return {
				...col,
				onCell: record => ({
					record,
					dataIndex: col.dataIndex,
					title: col.title,
					editing: this.isEditing(record)
				})
			}
		})

		return (
			<EditableContext.Provider value={this.props.form}>
				<Table
					size="small"
					components={components}
					bordered
					dataSource={this.props.data}
					columns={columns}
					rowClassName="editable-row"
					pagination={{
						onChange: this.cancel,
						pageSize: 15
					}}
				/>
			</EditableContext.Provider>
		)
	}
}

const EditableFormTable = Form.create()(EditableTable)
