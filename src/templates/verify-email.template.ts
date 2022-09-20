export const VerifyEmailTemplate = (link: string, name: string) => {
  return `<h3>Hi ${name}</h3>
    <p>for verify your email please open the link in your browser or click on it.</p>
    <p>if you don't know about that, you don't need to do anything.</p>
    <div>
        <a href="${link}">Click here for verify</a>
    </div>
    `;
};
