const welcomeMailTemplate = async (to, data={}) => {
    const subject = "artemisame esta";
        const html = `
            <div><span>8188991</span></div>
        `;

    return {
        to, 
        subject, 
        html
    }
}

module.exports = welcomeMailTemplate;