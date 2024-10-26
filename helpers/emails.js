import nodemailer from 'nodemailer'
const registerEmail = async(data)=>
{
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const {email,name,token}=data
    console.log(`desde nodemailer ${email}`);
    

    //send email
    await transport.sendMail({
        from:'FindJob.com',
        to:email,
        subject:'Confirm account in FindJob.com',
        text:'Confirm account in FindJob.com',
        html: `
                <p>Hello ${name},confirm your account in FindJob.com</p>
                <p>Your account is already there, just follow the link:
                <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirm/${token}">
                Confirm account</a>
                </p>
                <p>If you didn't create the account, You can ingnore the message</p> 
             `
    })
}

const emailForgotPassword = async(data)=>
    {
        const transport = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
        });
    
        const {email,name,token}=data
        console.log(`desde nodemailer ${email}`);
        
    
        //send email
        await transport.sendMail({
            from:'FindJob.com',
            to:email,
            subject:'Change your password in FindJob.com',
            text:'Confirm account in FindJob.com',
            html: `
                    <p>Hello ${name}, you have requested change your password in FindJob.com</p>
                    <p>You just follow the link:
                    <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/change-password/${token}">
                    Change password</a>
                    </p>
                    <p>If you didn't create the account, You can ingnore the message</p> 
                 `
        })
    }

    const resumeUpload = async(data)=>
        {
            const transport = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                auth: {
                  user: process.env.EMAIL_USER,
                  pass: process.env.EMAIL_PASS
                }
            });
        
            const {title,name,employer,email}=data
                    
            //send email
            await transport.sendMail({
                from:'FindJob.com',
                to:email,
                subject:'Resume upload FindJob.com',
                text:'Resume upload FindJob.com',
                html: `
                        <p>Hello ${employer},The user ${name} has upload resume to job ${title} FindJob.com</p>
                        <p>You can you ingnore the message</p> 
                     `
            })
        }
export {
    registerEmail,
    emailForgotPassword,
    resumeUpload
}