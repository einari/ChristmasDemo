import * as ko from "knockout";

export class Index
{
	constructor() {
		var self = this;
		this.stuff = ko.observable(0);
		
		this.horse = 42;
		
		this.horses = 43;
		this.something = 44;
		
		setInterval(() => {
			self.stuff(self.stuff()+6);
		}, 1000);	
	}
	
	doStuff() {
		return false;
	}
}