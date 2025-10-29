import bin from '../assets/images/icon-delete.svg'
import edit from "../assets/images/icon-edit.svg"
import reply from '../assets/images/icon-reply.svg'

import { useState } from 'react';


export default function Comment({ comment , currentUser ,onAddReply}){

    const [ newReply , setNewReply] = useState('');
    const [ showReplyBox , setShowReplyBox] = useState(false);
    const [vote , setVote] = useState(comment.score);


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
                            <button className='flex items-center gap-2'>
                                <img
                                src={bin}
                                />
                                <span>Delete</span>
                            </button>
                            <button className='flex items-center gap-2'>
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
                        />
                    )}
                </div>
            }
            
        </div>
        

    )
}