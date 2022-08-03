export interface Truck {
  	id: String
	type: String
	TimeInstant: String

	alias: String
	battery: Number
	dataTruck: DataTruck
	fuel: Number	
	lastMaintenance: lastMaintenance
	location: String
	motionDetection: Number
	motorTemperature: Number
  	workedHours: Number

	ownedBy: String
	relatedFarm: String
	relatedParcel: String
	
  	greenLight_info: String
	greenLight_status: String
	yellowLight_info: String
	yellowLight_status: String
  	redLight_info: String
	redLight_status: String
}
  
interface DataTruck {
	manufacturer: String
	model: String
	year: Number
}

interface lastMaintenance {
	description: String
	date: String
	type: String
	operator: lastMaintenance_Operator  
}

interface lastMaintenance_Operator {  
	id: String
	name: String
	field: String
	rfid: String 
}