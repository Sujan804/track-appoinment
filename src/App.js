import { BiArchive} from "react-icons/bi";
import Search from './components/Search.js';
import AddAppoinment from './components/AddAppoinment.js'
import AppoinmentInfo from "./components/AppoinmentInfo.js";
import { useCallback, useEffect, useState } from "react";
function App() {
  let [appointmentList, setAppointmentList] = useState([]);
  let [query,setQuery] = useState("");
  let [sortBy, setSortBy] = useState("peName");
  let [orderBy, setOrderBy] = useState("asc");
  
  const filterAppointments = appointmentList.filter(
    item =>{
      return (
        item.petName.toLowerCase().includes(query.toLowerCase()) ||
        item.ownerName.toLowerCase().includes(query.toLowerCase()) ||
        item.aptNotes.toLowerCase().includes(query.toLowerCase())||
        item.id.toLowerCase().includes(query.toLowerCase()) 
      )
    }
  ).sort((a, b) => {
    let order = (orderBy === 'asc') ? 1 : -1;
    return (
      a[sortBy] < b[sortBy]
        ? -1 * order : 1 * order
    )
  });
  const fetchData = useCallback(() => {
    fetch('./data.json')
      .then(response => response.json())
      .then(setAppointmentList)
  }, [])
  
  useEffect(() => {
    fetchData()
  }, [fetchData]);

  return (
    <div className="App container mx-auto mt-3 font-thin">
      <h1 className="text-5xl mb-3">
        <BiArchive className="inline-block
      text-red-400 align-top" /> Your Appointment
      </h1>
      <AddAppoinment
      onSendAppointment={myAppointment => setAppointmentList([...appointmentList,myAppointment])}
      lastId={appointmentList.reduce((max, item) => Number(item.id) > max ? Number(item.id) : max, 0)}
      />
      <Search query = {query}
      onQueryChange = {myQuery => setQuery(myQuery)}
      orderBy={orderBy}
      onOrderByChange={mySort => setOrderBy(mySort)}
      sortBy={sortBy}
      onSortByChange={mySort => setSortBy(mySort)}
      />
      <ul className="divide-y divide-gray-200">
        {filterAppointments.map(appointment =>(
          <AppoinmentInfo key={appointment.id}
              appointment={appointment}
              onDeleteAppointment={
                appointmentId =>
                  setAppointmentList(appointmentList.filter(appointment =>
                    appointment.id !== appointmentId))
              }
            />
        ))}
      </ul>
    </div>
  );
}

export default App;
