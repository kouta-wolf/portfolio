import { atom, computed } from 'nanostores';

export interface ChapterMeta {
	id: string;
	order: number;
	pageCount: number;
}

const initialChapters: ChapterMeta[] = [
	{ id: 'hero', order: 0, pageCount: 1 },
	{ id: 'about', order: 1, pageCount: 1 },
	{ id: 'portfolio', order: 2, pageCount: 1 },
	{ id: 'social', order: 3, pageCount: 1 },
];

export const $chapters = atom<ChapterMeta[]>(initialChapters);
export const $activeChapterId = atom<string>('hero');
export const $innerIndex = atom<number>(0);

export const $activeChapter = computed([$chapters, $activeChapterId], (chapters, activeId) =>
	chapters.find((chapter) => chapter.id === activeId),
);

const getChapters = () => $chapters.get();
const getChapterById = (id: string) => getChapters().find((chapter) => chapter.id === id);
const getSortedChapters = () => [...getChapters()].sort((a, b) => a.order - b.order);

export const setChapterPageCount = (id: string, count: number) => {
	const safeCount = Math.max(1, count);
	$chapters.set(
		getChapters().map((chapter) => (chapter.id === id ? { ...chapter, pageCount: safeCount } : chapter)),
	);
	const active = getChapterById($activeChapterId.get());
	if (active && $innerIndex.get() > active.pageCount - 1) {
		$innerIndex.set(active.pageCount - 1);
	}
};

export const goToChapter = (id: string) => {
	if (!getChapterById(id)) return;
	$activeChapterId.set(id);
	$innerIndex.set(0);
};

export const goNext = () => {
	const active = getChapterById($activeChapterId.get());
	if (!active) return;

	if ($innerIndex.get() < active.pageCount - 1) {
		$innerIndex.set($innerIndex.get() + 1);
		return;
	}

	const sorted = getSortedChapters();
	const currentPos = sorted.findIndex((chapter) => chapter.id === active.id);
	const next = sorted[currentPos + 1];
	if (next) {
		$activeChapterId.set(next.id);
		$innerIndex.set(0);
	}
};

export const goPrev = () => {
	const active = getChapterById($activeChapterId.get());
	if (!active) return;

	if ($innerIndex.get() > 0) {
		$innerIndex.set($innerIndex.get() - 1);
		return;
	}

	const sorted = getSortedChapters();
	const currentPos = sorted.findIndex((chapter) => chapter.id === active.id);
	const prev = sorted[currentPos - 1];
	if (prev) {
		$activeChapterId.set(prev.id);
		$innerIndex.set(prev.pageCount - 1);
	}
};
