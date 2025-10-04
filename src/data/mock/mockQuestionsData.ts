type Question = { question: string; answer: string; options: string[] };
export type QuizPoint = [longitude: number, latitude: number, question: Question];

export const mockQuizPoints: QuizPoint[] = [
	[-73.935242, 40.73061, { question: 'Which shark species is commonly found off the coast of New York?', answer: 'Sand tiger shark', options: ['Great white shark', 'Sand tiger shark', 'Hammerhead shark', 'Tiger shark'] }],
	[151.2093, -33.8688, { question: 'What is the primary diet of the reef shark?', answer: 'Small fish and invertebrates', options: ['Seals and sea lions', 'Plankton', 'Small fish and invertebrates', 'Sea birds'] }],
	[-157.8583, 21.3069, { question: 'Which behavior helps sharks detect prey at night?', answer: 'Ampullae of Lorenzini electroreception', options: ['Sonar clicks', 'Ampullae of Lorenzini electroreception', 'Bioluminescence', 'Infrared vision'] }],
	[18.4241, -33.9249, { question: 'True or False: Most shark species are threatened by overfishing.', answer: 'True', options: ['True', 'False'] }],
	[115.8575, -31.9505, { question: 'What adaptation helps fast pelagic sharks maintain high speeds?', answer: 'Heterocercal tail (large upper lobe)', options: ['Flattened body', 'Heterocercal tail (large upper lobe)', 'External gill slits', 'Suction cup fins'] }],
];