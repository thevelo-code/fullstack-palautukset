const Filter = ({ filter, handleFilterChange }) => (
  <div>
    suodata tekstillä <input value={filter} onChange={handleFilterChange} />
  </div>
)

export default Filter