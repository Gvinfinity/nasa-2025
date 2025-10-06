const IMG1="https://upload.wikimedia.org/wikipedia/commons/9/9a/Carcharias_taurus_SI.jpg";
const IMG2="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Blacktip_reef_shark_%28Carcharhinus_melanopterus%29_Moorea.jpg/1920px-Blacktip_reef_shark_%28Carcharhinus_melanopterus%29_Moorea.jpg";
const IMG3="https://upload.wikimedia.org/wikipedia/commons/2/25/Shark_at_Night_%2827318972973%29.jpg";
const IMG4="https://upload.wikimedia.org/wikipedia/commons/a/a0/Carcharhinus_isodon_in_net.JPG";
const IMG5="https://upload.wikimedia.org/wikipedia/commons/2/2f/Isurus_oxyrinchus_by_mark_conlin2.JPG";
type Question = { question: string; answer: string; options: string[], image: string };
export type QuizPoint = [longitude: number, latitude: number, question: Question];

export const mockQuizPoints: QuizPoint[] = [
	[-73.935242, 40.73061, { 
		question: 'Which shark species is commonly found off the coast of New York?', 
		answer: 'Sand tiger shark', 
		options: ['Great white shark', 'Sand tiger shark', 'Hammerhead shark', 'Tiger shark'], 
		image: IMG1 
	}], // New York
	[151.2093, -33.8688, { 
		question: 'What is the primary diet of the reef shark?', 
		answer: 'Small fish and invertebrates', 
		options: ['Seals and sea lions', 'Plankton', 'Small fish and invertebrates', 'Sea birds'], 
		image: IMG2 
	}], // Sydney
	[-157.8583, 21.3069, { 
		question: 'Which behavior helps sharks detect prey at night?', 
		answer: 'Electroreception', 
		options: ['Sonar clicks', 'Electroreception', 'Bioluminescence', 'Infrared vision'], 
		image: IMG3 
	}], // Hawaii
	[18.4241, -33.9249, { 
		question: 'True or False: Over one-third of shark species are threatened by overfishing.', 
		answer: 'True', 
		options: ['True', 'False'], 
		image: IMG4 
	}], // Cape Town
	[115.8575, -31.9505, { 
		question: 'What is the fastest shark in the world?', 
		answer: 'Shortfin mako shark', 
		options: ['Fastfin mako shark', 'Shortfin mako shark', 'Great white shark', 'Hammerhead shark'], 
		image: IMG5 
	}], // Perth
];
