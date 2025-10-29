export const FormEmailFormat = ({ name, date, time, address, status }) => `
<div style="font-family: Poppins, sans-serif; color: #333; line-height: 1.5; width: 90%; margin: 0 auto; padding: 20px; border: 1px solid #e2e2e2; border-radius: 8px; background-color: #f9f9f9;">

  <h2 style="margin-top: 10px;">
    Thank youuuuu<span style="color: green; font-weight: bold;">${name}</span>, your application has been successfully <span style="font-weight: bold;">added / updated</span>.
  </h2>

  <h3 style="margin-top: 20px; margin-bottom: 15px; color: #1D4ED8;">Your application Details</h3>

<table style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Name</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Date</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${date}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Time</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${time}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Address</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${address}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Status</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${status}</td>
    </tr>
  </table>

  <p style="margin-top: 20px;">Best regards,<br/>
  <span style="font-weight: bold;">Form Application System</span></p>

</div>
`;
