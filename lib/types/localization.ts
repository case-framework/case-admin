export interface ExpressionArg {
	dtype?: string;
	str?: string;
	num?: number;
}

export interface LocalisedObject {
	code: string;
	parts: Array<ExpressionArg | string | number>;
}
