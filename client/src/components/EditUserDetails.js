import React, { useEffect, useRef, useState } from 'react'
import Avatar from './Avatar'
import uploadFile from '../helpers/uploadFile'
import Divider from './Divider'
import axios from 'axios'
import taost from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { setUser } from '../redux/userSlice'


const EditUserDetails = ({onClose,user}) => {
    const [data,setData] = useState({
        
        name : user?.user||"",
        profile_pic : user?.profile_pic
    })
    const uploadPhotoRef = useRef()
    const dispatch = useDispatch()
    


    // useEffect(()=>{
    //     setData((preve)=>{
    //         return{
    //             ...preve,
    //             ...user
    //         }
    //     })
    // },[user])

    useEffect(() => {
        if (user) {
            setData({
                name: user.name || "",
                profile_pic: user.profile_pic || ""
            });
        }
    }, [user]);//changed 
    

    const handleOnChange = (e)=>{
        const { name, value } = e.target

        setData((preve)=>{
            return{
                ...preve,
                [name] : value
            }
        })
    }

    const handleOpenUploadPhoto = (e)=>{
        e.preventDefault()
        e.stopPropagation()

        uploadPhotoRef.current.click()
    }
    const handleUploadPhoto = async(e)=>{
        const file = e.target.files[0]
       // console.log("Selected file:", file); // debug
       
        const uploadPhoto = await uploadFile(file)

        setData((preve)=>{
        return{
            ...preve,
            profile_pic : uploadPhoto?.url
        }
        })
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()
        e.stopPropagation()
        console.log("Submitting data:", data)
        try {
            const URL = `${process.env.REACT_APP_BACKEND_URL}/api/update-user`
           console.log(URL); //debug
            const response = await axios({
                headers:{"Content-Type":"application/json"},
                method : 'post',
                url : URL,
                data : data, 
                withCredentials : true
            })

            console.log('response',response)
            taost.success(response?.data?.message)
            
            if(response.data.success){
                dispatch(setUser(response.data.data))
                onClose()
            }
         
        } catch (error) {
           //console.log(error)
            // taost.error(error)
            console.log("error in hit end")
            taost.error(error.message || "An unexpected error occurred")

        }
    }



    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     e.stopPropagation();
    
    //     // Filter out circular references before sending
    //     const filteredData = {
    //         name: data.name,
    //         profile_pic: data.profile_pic
    //     };
    
    //     console.log("Filtered Data:", filteredData);
    
    //     try {
    //         const URL = `${process.env.REACT_APP_BACKEND_URL}/api/update-user`;
    //         console.log("API URL:", URL);
    
    //         const response = await axios.post(URL, filteredData, {
    //             headers: { "Content-Type": "application/json" },
    //             withCredentials: true
    //         });
    
    //         console.log("Response:", response);
    //         taost.success(response?.data?.message);
    
    //         if (response.data.success) {
    //             dispatch(setUser(response.data.data));
    //             onClose();
    //         }
    //     } catch (error) {
    //         console.error("Error in API call:", error);
    
    //         if (error.response) {
    //             taost.error(error.response.data.message || "Server error occurred");
    //         } else if (error.request) {
    //             taost.error("No response from server. Please check your network.");
    //         } else {
    //             taost.error(error.message || "An unexpected error occurred");
    //         }
    //     }
    // };
    //gpt
    

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10'>
        <div className='bg-white p-4 py-6 m-1 rounded w-full max-w-sm'>
            <h2 className='font-semibold'>Profile Details</h2>
            <p className='text-sm '>Edit user details</p>

            <form className='grid gap-3 mt-3' onSubmit={handleSubmit}>
                <div className='flex flex-col gap-1'>
                    <label htmlFor='name'>Name:</label>
                    <input
                        type='text'
                        name='name'
                        id='name'
                        value={data.name}
                        onChange={handleOnChange}
                        className='w-full py-1 px-2 focus:outline-primary border-0.5'
                    />
                </div>

                <div>
                    <div>Photo:</div>
                    <div className='my-1 flex items-center gap-4'>
                        <Avatar
                            width={40}
                            height={40}
                            imageUrl={data?.profile_pic}
                            name={data?.name}
                        />
                        <label htmlFor='profile_pic'>
                        <button className='font-semibold' onClick={handleOpenUploadPhoto}>Change Photo</button>
                        <input
                            type='file'
                            id='profile_pic'
                            className='hidden'
                            onChange={handleUploadPhoto}
                            ref={uploadPhotoRef}
                        />
                        </label>
                    </div>
                </div>

                <Divider/>    
                <div className='flex gap-2 w-fit ml-auto '>
                    <button onClick={onClose} className='border-primary border text-primary px-4 py-1 rounded hover:bg-primary hover:text-white'>Cancel</button>
                    <button onClick={handleSubmit} className='border-primary bg-primary text-white border px-4 py-1 rounded hover:bg-secondary'>Save</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default React.memo(EditUserDetails)
