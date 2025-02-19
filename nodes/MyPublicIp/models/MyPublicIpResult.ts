export class MyPublicIpResult {
	interfaces: Interface[] = [];
}

export class Interface {
	family: string | null = null;
	address: string | null = null;
}
