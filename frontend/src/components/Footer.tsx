export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-col">
          <h4>FreshBite</h4>
          <p>Delicious food & beverages, ordered with ease.</p>
        </div>
        <div className="footer-col">
          <h4>Hours</h4>
          <p>Mon - Fri: 8 AM - 10 PM</p>
          <p>Sat - Sun: 9 AM - 11 PM</p>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <p>contact@freshbite.demo</p>
          <p>(555) 123-4567</p>
        </div>
        <div className="footer-col">
          <h4>Legal</h4>
          <p>Privacy Policy</p>
          <p>Terms of Service</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} FreshBite. All rights reserved.</p>
      </div>
    </footer>
  );
}
