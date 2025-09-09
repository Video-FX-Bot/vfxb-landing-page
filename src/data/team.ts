export interface TeamMember {
    id: string;
    name: string;
    role: string;
    description: string;
    image: string;
    experience: string;
    social: {
        linkedin: string;
        twitter: string;
    };
}

export const teamMembers: TeamMember[] = [
    {
        id: 'person-1',
        name: 'Person 1',
        role: 'Founder & CEO',
        description: 'Visionary leader with deep expertise in AI and video technology. Driving the future of content creation.',
        experience: '8+ years',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
        social: {
            linkedin: '#',
            twitter: '#'
        }
    },
    {
        id: 'person-2',
        name: 'Person 2',
        role: 'Chief Technology Officer',
        description: 'Technical architect building scalable AI infrastructure. Expert in distributed systems and machine learning.',
        experience: '7+ years',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
        social: {
            linkedin: '#',
            twitter: '#'
        }
    },
    {
        id: 'person-3',
        name: 'Person 3',
        role: 'AI Engineer',
        description: 'AI specialist focused on computer vision and neural networks. Building the core intelligence behind VFXB.',
        experience: '5+ years',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
        social: {
            linkedin: '#',
            twitter: '#'
        }
    },
    {
        id: 'person-4',
        name: 'Person 4',
        role: 'AI Engineer',
        description: 'AI specialist focused on computer vision and neural networks. Building the core intelligence behind VFXB.',
        experience: '5+ years',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
        social: {
            linkedin: '#',
            twitter: '#'
        }
    },
    {
        id: 'person-5',
        name: 'Person 5',
        role: 'AI Engineer',
        description: 'AI specialist focused on computer vision and neural networks. Building the core intelligence behind VFXB.',
        experience: '5+ years',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
        social: {
            linkedin: '#',
            twitter: '#'
        }
    },
    {
        id: 'person-6',
        name: 'Person 6',
        role: 'AI Engineer',
        description: 'AI specialist focused on computer vision and neural networks. Building the core intelligence behind VFXB.',
        experience: '5+ years',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
        social: {
            linkedin: '#',
            twitter: '#'
        }
    }
];


