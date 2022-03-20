import { useParams } from 'react-router-dom';

function AdminLanding() {
  return (
    <form>
      <label>
        password:
        <input type="text" name="password" />
      </label>
      <input type="submit" value="Submit" />
    </form>
  )
}
export default AdminLanding