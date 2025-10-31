
import { useState } from 'react' ;

export default function SearchBox({currentUser , onAddComment}){
    const [newComment , setNewComment] = useState('')

    function handleSubmit(e){
        e.preventDefault();

        if(newComment.trim()){
            const comment = {
                'id' : Date.now(),
                'content' : newComment,
                'createdAt' : 'just now',
                'score': 0,
                'user' : {
                    'image' : currentUser.image,
                    'username' : currentUser.username
                },
                'replies' : []
            };

            onAddComment(comment);
            setNewComment('');
        }
    }

    return (
       <section className="bg-white p-6 rounded-xl">
            <form onSubmit={handleSubmit} className='flex flex-col md:flex-row md:items-start gap-4'>
                <img
                    src={currentUser.image.png}
                    className='hidden md:block w-10 h-10 rounded-full object-cover shrink-0'
                    alt={currentUser.username}
                />
                <textarea
                    name="addComment"
                    value={newComment}
                    placeholder='Add a comment...'
                    rows={4}
                    className='border-gray-400 border p-4 w-full rounded-xl flex-1 resize-none'
                    onChange={(e) => setNewComment(e.target.value)}
                />

                <div className='flex justify-between items-center md:hidden'>
                    <img
                    src={currentUser.image.png}
                    className='w-11 h-11 object-cover rounded-full'
                    alt={currentUser.username}
                    />
                    <button
                    className='bg-purple-600 text-gray-300 px-6 py-3 rounded-md'
                    type='submit'
                    >SEND</button>
                </div>
                <button
                    className='hidden md:block bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 font-semibold self-start'
                    type='submit'
                >
                    SEND
                </button>
            </form>
            
       </section>
    )
}