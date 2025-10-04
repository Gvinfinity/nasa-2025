const IMG="https://defendersofwildlife-360365372.imgix.net/sites/default/files/2024-09/2018.10.26%20-%20Shark%20Baring%20Teeth%20Near%20Water%20Surface%20-%20Isla%20Guadalupe%20-%20Mexico%20-%20Valeria%20Mas.jpg?fit=max&ixlib=php-4.1.0&w=2000%201x"
type Question = { question: string; answer: string; options: string[], image: string };
export type QuizPoint = [longitude: number, latitude: number, question: Question];

export const mockQuizPoints: QuizPoint[] = [
	[-73.935242, 40.73061, { question: 'Which shark species is commonly found off the coast of New York?', answer: 'Sand tiger shark', options: ['Great white shark', 'Sand tiger shark', 'Hammerhead shark', 'Tiger shark'], image: IMG }],
	[151.2093, -33.8688, { question: 'What is the primary diet of the reef shark?', answer: 'Small fish and invertebrates', options: ['Seals and sea lions', 'Plankton', 'Small fish and invertebrates', 'Sea birds'], image: IMG }],
	[-157.8583, 21.3069, { question: 'Which behavior helps sharks detect prey at night?', answer: 'Ampullae of Lorenzini electroreception', options: ['Sonar clicks', 'Ampullae of Lorenzini electroreception', 'Bioluminescence', 'Infrared vision'], image: IMG }],
	[18.4241, -33.9249, { question: 'True or False: Most shark species are threatened by overfishing.', answer: 'True', options: ['True', 'False'], image: IMG }],
	[115.8575, -31.9505, { question: 'What adaptation helps fast pelagic sharks maintain high speeds?', answer: 'Heterocercal tail (large upper lobe)', options: ['Flattened body', 'Heterocercal tail (large upper lobe)', 'External gill slits', 'Suction cup fins'], image: IMG }],
];