import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { Button, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getUserDetails, updateUser } from '../actions/userActions'
import FormContainer from '../components/FormContainer'
import {USER_UPDATE_RESET} from '../constants/userConstants'
const UserEditScreen = ({ match, history }) => {
    const userId = match.params.id

    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [isAdmin, setisAdmin] = useState('')

    const dispatch = useDispatch()

    const userDetails = useSelector(state => state.userDetails)
    const {loading, error, user } = userDetails

    const userUpdate = useSelector(state => state.userUpdate)
    const {loading:loadingUpdate, error:errorUpdate, succes:succesUpdate } = userUpdate


    useEffect(() => {
        if(succesUpdate){
            dispatch({ type: USER_UPDATE_RESET })
            history.push('/admin/userlist')
        }else{
            if(!user.name || user._id!== userId){
                dispatch(getUserDetails(userId))
            }else{
                setName(user.name)
                setEmail(user.email)
                setisAdmin(user.isAdmin)
            }
        }
    }, [dispatch, history, userId, user, succesUpdate])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateUser({_id: userId, name, email, isAdmin}))
    }
    
    return (
        <>
        <Link to='/admin/userlist' className='btn btn-light my-3'>
            Go back
        </Link>
        <FormContainer>
            <h1>Edit User</h1>
            {loadingUpdate && <Loader />}
            {errorUpdate && <Message variant='danger'> {errorUpdate}</Message>}
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> :
            (
                <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control type='name' placeholder='Enter name' value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group controlId='email'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type='email' placeholder='Enter email' value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group controlId='isadmin'>
                    <Form.Check type='checkbox' label='Is Admin' checked={isAdmin} onChange={(e) => setisAdmin(e.target.checked)}></Form.Check>
                </Form.Group>
                <Button type='submit' variant='primary'>
                   Update
                </Button>
            </Form>
            )}
        </FormContainer>
        </>
    )
}

export default UserEditScreen