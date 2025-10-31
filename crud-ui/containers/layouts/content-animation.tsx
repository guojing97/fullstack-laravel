const ContentAnimation = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            {/* BEGIN CONTENT AREA */}
            <div className={`animate__fadeIn animate__animated p-6`}>{children}</div>
            {/* END CONTENT AREA */}
        </>
    );
}

export default ContentAnimation;