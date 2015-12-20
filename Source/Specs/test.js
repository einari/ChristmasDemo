/// <reference path="../jasmine.js"/>

import * as ko from "knockout";
import {Index} from "index";

describe("hello", () => {
	let i = null;
	
	beforeEach(() => {
		i = new Index();	
	});
	
	it("should do stuff", () => {
		expect(i.doStuff()).toBe(false);
	})
});