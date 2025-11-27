import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { id, correct } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Word ID is required' }, { status: 400 });
        }

        const word = await prisma.word.findUnique({
            where: { id: Number(id) },
        });

        if (!word) {
            return NextResponse.json({ error: 'Word not found' }, { status: 404 });
        }

        if (correct) {
            const newLevel = word.masteryLevel + 1;

            if (newLevel >= 3) {
                // Delete word if mastered 3 times
                await prisma.word.delete({
                    where: { id: Number(id) },
                });
                return NextResponse.json({ message: 'Word mastered and removed!', mastered: true });
            } else {
                // Increment mastery level
                const updatedWord = await prisma.word.update({
                    where: { id: Number(id) },
                    data: { masteryLevel: newLevel },
                });
                return NextResponse.json({ message: 'Mastery level increased', word: updatedWord, mastered: false });
            }
        } else {
            // If wrong, maybe reset or decrement? For now, just keep it same or decrement if > 0
            // Let's decrement to make it harder
            const newLevel = Math.max(0, word.masteryLevel - 1);
            const updatedWord = await prisma.word.update({
                where: { id: Number(id) },
                data: { masteryLevel: newLevel },
            });
            return NextResponse.json({ message: 'Mastery level decreased', word: updatedWord, mastered: false });
        }

    } catch (error) {
        console.error('Error updating word mastery:', error);
        return NextResponse.json({ error: 'Failed to update word' }, { status: 500 });
    }
}
