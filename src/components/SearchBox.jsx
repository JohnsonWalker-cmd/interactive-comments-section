
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
       <section className="bg-white p-6 flex flex-col gap-4">
            <form onSubmit={handleSubmit}>
                <textarea
                    name="addComment"
                    value={newComment}
                    placeholder='Add a comment...'
                    rows={4}
                    className='border-gray-400 border p-4 w-full rounded-xl'
                    onChange={(e) => setNewComment(e.target.value)}
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
                    >SEND</button>
                </div>
            </form>
            
       </section>
    )
}