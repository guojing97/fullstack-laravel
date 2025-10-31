const CardPost = (props: { source?: string, title: string, content: string, className?: string }) => {
    return (
        <div className={`${props.className} card w-full bg-base-100 shadow-xl cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 
            hover:scale-[1.02] hover:-translate-y-1`}>
            <figure>
                <img src={props.source} alt="Post Image" />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{props.title}</h2>
                <p>{props.content}</p>
            </div>
        </div>
    );
};

export default CardPost;