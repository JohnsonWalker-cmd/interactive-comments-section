import bin from '../assets/images/icon-delete.svg'
import edit from "../assets/images/icon-edit.svg"
import reply from '../assets/images/icon-reply.svg'

import { useState } from 'react';


export default function Comment({ comment , currentUser ,onAddReply , onDelete , onEdit}){

    const [ newReply , setNewReply] = useState('');
    const [ showReplyBox , setShowReplyBox] = useState(false);
    const [vote , setVote] = useState(comment.score);
    const [ modal , setModal] = useState(false);
    const [ isEditing , setIsEditing] = useState(false);
    const [ editedContent , setEditedContent] = useState('');


    function handleUpVote(){
        setVote(prevVote => prevVote + 1);
    }

    function handleDownVote(){
        setVote(prevVote => prevVote > 0 ? prevVote - 1 : 0);
    }

    function handleReplySubmit(e){
        e.preventDefault();

        if(newReply.trim()){
            const currentReply = {
                'id' : Date.now(),
                'content' : newReply,
                'createdAt' : 'just now',
                'score': 0,
                'replyingTo' : comment.user.username,
                'user' : {
                    'image' : currentUser.image,
                    'username' : currentUser.username
                }
            }
            onAddReply(currentReply , comment.id);
            setNewReply('');
            setShowReplyBox(false);
        }
    }

    function handleDelete(){
        onDelete(comment.id)
        setModal(false);
    }

    function handleUpdate(){
        if(editedContent.trim()){
            onEdit(comment.id ,editedContent)
            setIsEditing(false)
        }
    }
    const isCurrentUser = comment.user.username === currentUser.username;


    return (
        <div className="mb-6">
            <div className="flex bg-white rounded-xl gap-4 flex-col p-4 mb-3">
                {/**Profile section */}
                <div className='flex gap-2 items-center'>
                    <img
                    src={comment.user.image.png}
                    alt={comment.user.username}
                    className='max-w-full object-cover w-8 h-8'
                    />
                    <span className='text-gray-800'>{comment.user.username}</span>
                    {isCurrentUser && 
                        <span className='bg-purple-600 text-gray-300 px-2 text-center rounded-md'>you</span>
                    }
                    <span className='text-gray-500'>{comment.createdAt}</span>
                </div>
                <p className='text-gray-500'>
                    {comment.replyingTo && (
                        <span className='text-purple-600 font-semibold'>@{comment.replyingTo} </span>
                    )}

                    {comment.content}
                </p>

                <div className="flex justify-between">
                    <div className='text-purple-200 flex gap-6 bg-purple-50 p-2 rounded-sm'>
                        <button
                        onClick={handleUpVote}
                        >
                            +
                        </button>
                        <span className='text-purple-600'>{vote}</span>
                        <button
                        onClick={handleDownVote}
                        >
                            -
                        </button>
                    </div>
                    { isCurrentUser ? (
                        <div className='flex gap-4'>
                            <button className='flex items-center gap-2' onClick={() => setModal(!modal)}>
                                <img
                                src={bin}
                                />
                                <span>Delete</span>
                            </button>
                            <button 
                            className='flex items-center gap-2'
                            onClick={() => {
                                setIsEditing(!isEditing);
                                setEditedContent(comment.content);
                            }}
                            >
                                <img
                                src={edit}
                                />
                                <span>Edit</span>
                            </button>
                        </div>
                        ) :

                        <>
                            <button 
                                className='flex gap-2 items-center'
                                onClick={() => setShowReplyBox(!showReplyBox)}
                            >
                                <img
                                src={reply}
                                className='max-w-full object-contain w-4 h-4'
                                />
                                <span className='text-purple-600 font-bold'>Reply</span>
                            </button>
                        </>
                    }
                    
                </div>

            </div>
            { isEditing && (
                <section className="bg-white p-6 rounded-xl flex flex-col gap-4 mb-3">
                    <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        rows={4}
                        className='border-gray-400 border p-4 w-full rounded-xl resize-none'
                    />
                    <div className='flex justify-between items-center'>
                        <img
                            src={currentUser.image.png}
                            className='w-11 h-11 rounded-full object-cover'
                            alt={currentUser.username}
                        />
                        <button
                            className='bg-purple-600 text-white px-8 py-3 rounded-md hover:bg-purple-700 font-semibold'
                            onClick={handleUpdate}
                            type='button'
                        >
                            UPDATE
                        </button>
                    </div>
                </section>
                )
            }
            {showReplyBox && 
                <section className="bg-white p-6 flex flex-col gap-4">
                    <form onSubmit={handleReplySubmit}>
                        <textarea
                            name="newReply"
                            value={newReply}
                            placeholder='Add a comment...'
                            rows={4}
                            className='border-gray-400 border p-4 w-full rounded-xl'
                            onChange={(e) => setNewReply(e.target.value)}
                        />

                        <div className='flex justify-between items-center'>
                            <img
                                src={currentUser.image.png}
                                className='max-w-full w-11 h-11'
                                alt={currentUser.username}
                            />
                            <button
                                className='bg-purple-600 text-gray-300 px-6 py-3 rounded-md'
                                type='submit'
                            >
                            REPLY
                            </button>
                        </div>
                    </form>
                                
                </section>
            }

            { comment.replies && comment.replies.length > 0 &&
                <div className='ml-1 border-l-2 border-gray-200 pl-8 flex flex-col gap-2'>
                    {comment.replies.map(reply => 
                        <Comment
                        key={reply.id}
                        comment={reply}
                        currentUser={currentUser}
                        onAddReply={onAddReply}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        />
                    )}
                </div>
            }
            {
                modal && (
                <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-50'>
                    <div className='bg-white flex flex-col gap-4 p-6 rounded-2xl shadow-xl max-w-sm w-80 mx-4'>
                        <h3 className='text-gray-800 font-bold text-xl'>Delete comment</h3>
                        <p className='text-gray-600'>Are you sure you want to delete this comment? This will remove the comment and can't be undone</p>
                        <section className='flex justify-between mt-4'>
                            <button
                            className='bg-gray-500 text-gray-50 p-4 rounded-xl'
                            onClick={()=> setModal(false)}
                            >NO ,CANCEL</button>
                            <button
                            className='bg-pink-400 text-gray-300 p-4 rounded-xl'
                            onClick={handleDelete}
                            >YES ,DELETE</button>
                        </section>
                    </div>
                </div>
                )
            }
            
        </div>
        

    )
}