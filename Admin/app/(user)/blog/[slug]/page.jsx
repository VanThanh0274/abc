import posts from '../../../../data/data';
import ReactMarkdown from 'react-markdown';

export default function BlogDetail({ params }) {
    const post = posts.find(p => p.id === params.slug);

    if (!post) return <div>Không tìm thấy bài viết</div>;

    return (
        <div>
            <h4>{post.title}</h4>
            <ReactMarkdown
                components={{
                    img: ({ node, ...props }) => (
                        <img {...props} style={{ maxWidth: '100%', borderRadius: '12px' }} />
                    ),
                    strong: ({ node, ...props }) => (<strong style={{ lineHeight: 1.9 }} {...props} />),
                    p: ({ node, ...props }) => (<p style={{ lineHeight: 1.9 }} {...props} />)
                    

                }}
            
        >{post.content}</ReactMarkdown>
        </div>
    );
}
