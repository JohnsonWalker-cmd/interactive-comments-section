import bin from '../assets/images/icon-delete.svg'
import edit from "../assets/images/icon-edit.svg"
import reply from '../assets/images/icon-reply.svg'
import { useState } from 'react';

export default function Comment({ comment, currentUser, onAddReply, onDelete, onEdit}){
    const [newReply, setNewReply] = useState('');
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [vote, setVote] = useState(comment.score);
    const [modal, setModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState('');

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
                'id': Date.now(),
                'content': newReply,
                'createdAt': 'just now',
                'score': 0,
                'replyingTo': comment.user.username,
                'user': {
                    'image': currentUser.image,
                    'username': currentUser.username
                }
            }
            onAddReply(currentReply, comment.id);
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
            onEdit(comment.id, editedContent)
            setIsEditing(false)
        }
    }

    const isCurrentUser = comment.user.username === currentUser.username;

    return (
        <div className="mb-4">
            <div className="flex flex-col md:flex-row bg-white rounded-xl gap-4 p-6">
                
                
                <div className='hidden md:flex flex-col items-center gap-3 bg-gray-100 rounded-lg px-3 py-2 self-start'>
                    <button
                        onClick={handleUpVote}
                        className='text-indigo-500 hover:text-indigo-700 font-bold text-lg'
                    >
                        +
                    </button>
                    <span className='text-indigo-600 font-semibold'>{vote}</span>
                    <button
                        onClick={handleDownVote}
                        className='text-indigo-500 hover:text-indigo-700 font-bold text-lg'
                    >
                        −
                    </button>
                </div>

                <div className='flex-1 flex flex-col gap-4'>
                    {/* Profile section */}
                    <div className='flex justify-between items-center'>
                        <div className='flex gap-3 items-center'>
                            <img
                                src={comment.user.image.png}
                                alt={comment.user.username}
                                className='w-8 h-8 rounded-full object-cover'
                            />
                            <span className='text-gray-800 font-semibold'>{comment.user.username}</span>
                            {isCurrentUser && 
                                <span className='bg-indigo-600 text-white px-2 py-1 text-xs rounded-sm font-semibold'>you</span>
                            }
                            <span className='text-gray-500'>{comment.createdAt}</span>
                        </div>

                        
                        <div className='hidden md:flex gap-4'>
                            {isCurrentUser ? (
                                <>
                                    <button 
                                        className='flex items-center gap-2 text-red-500 font-semibold hover:opacity-70'
                                        onClick={() => setModal(true)}
                                    >
                                        <img src={bin} alt="delete" className='w-4 h-4' />
                                        <span>Delete</span>
                                    </button>
                                    <button 
                                        className='flex items-center gap-2 text-indigo-600 font-semibold hover:opacity-70'
                                        onClick={() => {
                                            setIsEditing(!isEditing);
                                            setEditedContent(comment.content);
                                        }}
                                    >
                                        <img src={edit} alt="edit" className='w-4 h-4' />
                                        <span>Edit</span>
                                    </button>
                                </>
                            ) : (
                                <button 
                                    className='flex gap-2 items-center text-indigo-600 font-semibold hover:opacity-70'
                                    onClick={() => setShowReplyBox(!showReplyBox)}
                                >
                                    <img
                                        src={reply}
                                        alt="reply"
                                        className='w-4 h-4'
                                    />
                                    <span>Reply</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Comment content */}
                    <p className='text-gray-600'>
                        {comment.replyingTo && (
                            <span className='text-indigo-600 font-semibold'>@{comment.replyingTo} </span>
                        )}
                        {comment.content}
                    </p>
                    <div className="flex md:hidden justify-between items-center">
                        {/* Vote section for mobile */}
                        <div className='flex gap-4 bg-gray-100 rounded-lg px-4 py-2 items-center'>
                            <button
                                onClick={handleUpVote}
                                className='text-indigo-500 hover:text-indigo-700 font-bold'
                            >
                                +
                            </button>
                            <span className='text-indigo-600 font-semibold'>{vote}</span>
                            <button
                                onClick={handleDownVote}
                                className='text-indigo-500 hover:text-indigo-700 font-bold'
                            >
                                −
                            </button>
                        </div>

                        {/* Mobile buttons */}
                        <div className='flex gap-4'>
                            {isCurrentUser ? (
                                <>
                                    <button 
                                        className='flex items-center gap-2 text-red-500 font-semibold'
                                        onClick={() => setModal(true)}
                                    >
                                        <img src={bin} alt="delete" className='w-4 h-4' />
                                        <span>Delete</span>
                                    </button>
                                    <button 
                                        className='flex items-center gap-2 text-indigo-600 font-semibold'
                                        onClick={() => {
                                            setIsEditing(!isEditing);
                                            setEditedContent(comment.content);
                                        }}
                                    >
                                        <img src={edit} alt="edit" className='w-4 h-4' />
                                        <span>Edit</span>
                                    </button>
                                </>
                            ) : (
                                <button 
                                    className='flex gap-2 items-center text-indigo-600 font-semibold'
                                    onClick={() => setShowReplyBox(!showReplyBox)}
                                >
                                    <img src={reply} alt="reply" className='w-4 h-4' />
                                    <span>Reply</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit section */}
            {isEditing && (
                <section className="bg-white p-6 rounded-xl mt-4">
                    <div className='flex flex-col md:flex-row md:items-start gap-4'>
                        <img
                            src={currentUser.image.png}
                            className='hidden md:block w-10 h-10 rounded-full object-cover flex-shrink-0'
                            alt={currentUser.username}
                        />
                        <textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            rows={4}
                            className='border-gray-400 border p-4 w-full rounded-xl resize-none flex-1'
                        />
                        <div className='flex md:hidden justify-between items-center'>
                            <img
                                src={currentUser.image.png}
                                className='w-11 h-11 rounded-full object-cover'
                                alt={currentUser.username}
                            />
                            <button
                                className='bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 font-semibold'
                                onClick={handleUpdate}
                                type='button'
                            >
                                UPDATE
                            </button>
                        </div>
                        <button
                            className='hidden md:block bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 font-semibold self-start'
                            onClick={handleUpdate}
                            type='button'
                        >
                            UPDATE
                        </button>
                    </div>
                </section>
            )}

            {/* Reply box */}
            {showReplyBox && (
                <section className="bg-white p-6 rounded-xl mt-4">
                    <form onSubmit={handleReplySubmit} className='flex flex-col md:flex-row md:items-start gap-4'>
                        <img
                            src={currentUser.image.png}
                            className='hidden md:block w-10 h-10 rounded-full object-cover shrink-0'
                            alt={currentUser.username}
                        />
                        <textarea
                            name="newReply"
                            value={newReply}
                            placeholder='Add a reply...'
                            rows={4}
                            className='border-gray-400 border p-4 w-full rounded-xl resize-none flex-1'
                            onChange={(e) => setNewReply(e.target.value)}
                        />
                        <div className='flex md:hidden justify-between items-center'>
                            <img
                                src={currentUser.image.png}
                                className='w-11 h-11 rounded-full object-cover'
                                alt={currentUser.username}
                            />
                            <button
                                className='bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 font-semibold'
                                type='submit'
                            >
                                REPLY
                            </button>
                        </div>
                        <button
                            className='hidden md:block bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 font-semibold self-start'
                            type='submit'
                        >
                            REPLY
                        </button>
                    </form>
                </section>
            )}

            {/* Nested replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div className='ml-4 md:ml-10 border-l-2 border-gray-200 pl-4 md:pl-10 mt-4 flex flex-col gap-4'>
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
            )}

            
            {modal && (
                <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-50'>
                    <div className='bg-white flex flex-col gap-4 p-6 rounded-2xl shadow-xl max-w-sm w-80 mx-4'>
                        <h3 className='text-gray-800 font-bold text-xl'>Delete comment</h3>
                        <p className='text-gray-600'>
                            Are you sure you want to delete this comment? This will remove the comment and can't be undone.
                        </p>
                        <section className='flex gap-3 justify-end mt-2'>
                            <button
                                className='bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold uppercase'
                                onClick={() => setModal(false)}
                            >
                                No, Cancel
                            </button>
                            <button
                                className='bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold uppercase'
                                onClick={handleDelete}
                            >
                                Yes, Delete
                            </button>
                        </section>
                    </div>
                </div>
            )}
        </div>
    )
}