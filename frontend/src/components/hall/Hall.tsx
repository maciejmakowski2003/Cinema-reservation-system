import SeatPicker from "../seat-picker/SeatPicker"
import "./hall.scss"

const Hall = () => {
    return (
        <div id="hall">
            <SeatPicker />
            <div id="legend">
                <h4>Legend</h4>
                <div>
                    <div className="legend-row">
                        <div className="seat"></div>
                        <span>Availabe</span>
                    </div>
                    <div className="legend-row">
                        <div className="seat seat-occupied"></div>
                        <span>Occupied</span>
                    </div>

                    <div className="legend-row">
                        <div className="seat seat-selected"></div>
                        <span>Selected</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hall