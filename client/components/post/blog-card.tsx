import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { BlogPost } from '../../lib';

interface BlogCardProps {
    post: BlogPost;
    currentLocale: 'en' | 'ar';
}

export default function BlogCard({ post, currentLocale }: BlogCardProps) {
    const t = useTranslations();
    const title = currentLocale === 'ar' ? post.title_ar : post.title_en;
    const content = currentLocale === 'ar' ? post.content_ar : post.content_en;
    const category = currentLocale === 'ar' ? post.category_ar : post.category_en;

    return (
        <Link href={`/${currentLocale}/blog/${post.id}`} scroll={true}>
            <motion.div
                id={`blog-post-${post.id}`}
                className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200"
                whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
                transition={{ duration: 0.3 }}
                dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}
            >
                <Image
                    src={post.image || '/placeholder.svg'}
                    width={400}
                    height={300}
                    alt={title}
                    className="w-full h-56 object-cover"
                />
                <div className="p-4 bg-green-50 min-h-full">
                    <h3 className="text-xl font-medium text-teal-600 mb-2">{title}</h3>
                    <p className="text-sm text-gray-700 mb-4 line-clamp-3">{content}</p>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-teal-600 bg-teal-100 px-2 py-1 rounded-full">
                            {category}
                        </span>
                        <div className="text-sm text-teal-600 flex items-center font-medium">
                            {t('home.readMore', { default : 'Read more' })}
                            <ArrowRight
                                className={`w-4 h-4 ${currentLocale === 'ar' ? 'mr-1' : 'ml-1'}`}
                            />
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}