import { useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Book,
  Search,
  FileText,
  Video,
  Award,
  ExternalLink,
  X,
  Filter,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";

export function KnowledgeHub() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("manuals");
  
  const handleRedirection = (url) => {
  if (!url) return;
  // This opens the link in a new tab
  window.open(url, "_blank", "noopener,noreferrer");
};

  const manuals = [
    {
      title: "CGWB RWH Manual 2023",
      description:
        "Complete guide for residential rainwater harvesting",
      type: "PDF",
      pages: 45,
      category: "Technical",
      url: "https://cgwa.mowr.gov.in/Documents/Manual-Artificial-Recharge.pdf"
    },
    {
      title: "BWSSB Installation Guidelines",
      description:
        "Bangalore Water Supply guidelines and approvals",
      type: "PDF",
      pages: 28,
      category: "Regulatory",
    },
    {
      title: "Tamil Nadu RWH Rules",
      description:
        "State-specific regulations and requirements",
      type: "PDF",
      pages: 15,
      category: "Legal",
    },
  ];

  const videos = [
    {
      title: "RWH System Installation",
      duration: "12:45",
      views: "25K",
      category: "Installation",
    },
    {
      title: "Tank Maintenance Guide",
      duration: "8:30",
      views: "18K",
      category: "Maintenance",
    },
    {
      title: "First Flush Diverter Setup",
      duration: "6:15",
      views: "12K",
      category: "Components",
    },
  ];

  const successStories = [
    {
      title: "Koramangala Community RWH",
      location: "Bangalore, Karnataka",
      impact: "50,000L daily collection",
      homes: 120,
      savings: "₹2.5L annually",
    },
    {
      title: "Villa Project - Whitefield",
      location: "Bangalore, Karnataka",
      impact: "25,000L daily collection",
      homes: 45,
      savings: "₹1.2L annually",
    },
  ];

  const faqs = [
    {
      question:
        "What is the minimum roof area required for RWH?",
      answer:
        "Any roof area can be used for RWH. Even a 30 sq.m roof can collect 1000+ liters during monsoon.",
    },
    {
      question: "Is RWH mandatory in my city?",
      answer:
        "RWH is mandatory for buildings >30 sq.m in Bangalore, Chennai, and many other cities in India.",
    },
    {
      question: "How much does a basic RWH system cost?",
      answer:
        "A basic residential RWH system costs ₹15,000-50,000 depending on tank capacity and components.",
    },
  ];

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  // Search functionality
  const searchInContent = (
    items: any[],
    searchFields: string[],
  ) => {
    if (!searchQuery.trim()) return items;

    const query = searchQuery.toLowerCase().trim();
    return items.filter((item) =>
      searchFields.some((field) =>
        item[field]?.toLowerCase().includes(query),
      ),
    );
  };

  const filteredManuals = useMemo(
    () =>
      searchInContent(manuals, [
        "title",
        "description",
        "category",
      ]),
    [searchQuery],
  );

  const filteredVideos = useMemo(
    () => searchInContent(videos, ["title", "category"]),
    [searchQuery],
  );

  const filteredSuccessStories = useMemo(
    () =>
      searchInContent(successStories, [
        "title",
        "location",
        "impact",
      ]),
    [searchQuery],
  );

  const filteredFaqs = useMemo(
    () => searchInContent(faqs, ["question", "answer"]),
    [searchQuery],
  );

  // Get total results count
  const totalResults =
    filteredManuals.length +
    filteredVideos.length +
    filteredSuccessStories.length +
    filteredFaqs.length;

  const hasSearchQuery = searchQuery.trim().length > 0;
  const hasResults = totalResults > 0;

  const clearSearch = () => {
    setSearchQuery("");
  };

  const renderSearchResults = () => {
    if (!hasSearchQuery) return null;

    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="mb-4 p-3 bg-muted/50 rounded-lg border"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {hasResults
                ? `${totalResults} results found`
                : "No results found"}
            </span>
          </div>
          {hasResults && (
            <div className="flex gap-1 text-xs text-muted-foreground">
              {filteredManuals.length > 0 && (
                <span>{filteredManuals.length} manuals</span>
              )}
              {filteredVideos.length > 0 && (
                <span>{filteredVideos.length} videos</span>
              )}
              {filteredSuccessStories.length > 0 && (
                <span>
                  {filteredSuccessStories.length} stories
                </span>
              )}
              {filteredFaqs.length > 0 && (
                <span>{filteredFaqs.length} FAQs</span>
              )}
            </div>
          )}
        </div>
        {!hasResults && (
          <p className="text-sm text-muted-foreground">
            Try searching for keywords like "installation",
            "maintenance", "cost", or "guidelines"
          </p>
        )}
      </motion.div>
    );
  };

  const renderEmptyState = (type: string) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-8"
    >
      <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
      <h3 className="font-medium mb-1">No {type} found</h3>
      <p className="text-sm text-muted-foreground mb-4">
        No {type} match your search "{searchQuery}"
      </p>
      <Button variant="outline" size="sm" onClick={clearSearch}>
        Clear search
      </Button>
    </motion.div>
  );

  return (
    <motion.div
      className="p-4 space-y-6 max-w-md mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="text-center pb-6">
            <CardTitle className="flex items-center justify-center gap-2">
              <Book className="w-5 h-5 text-primary" />
              Knowledge Hub
            </CardTitle>
            <CardDescription>
              Learn everything about rainwater harvesting
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Search */}
      <motion.div className="relative" variants={itemVariants}>
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10"
          size={16}
        />
        <Input
          placeholder="Search guides, videos, FAQs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {hasSearchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <X size={16} />
          </button>
        )}
      </motion.div>

      {/* Search Results Summary */}
      {renderSearchResults()}

      <motion.div variants={itemVariants}>
        <Tabs
          defaultValue="manuals"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger
              value="manuals"
              className="text-xs relative"
            >
              Manuals
              {hasSearchQuery && filteredManuals.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 h-4 px-1 text-xs"
                >
                  {filteredManuals.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="videos"
              className="text-xs relative"
            >
              Videos
              {hasSearchQuery && filteredVideos.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 h-4 px-1 text-xs"
                >
                  {filteredVideos.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="success"
              className="text-xs relative"
            >
              Stories
              {hasSearchQuery &&
                filteredSuccessStories.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-4 px-1 text-xs"
                  >
                    {filteredSuccessStories.length}
                  </Badge>
                )}
            </TabsTrigger>
            <TabsTrigger
              value="faq"
              className="text-xs relative"
            >
              FAQ
              {hasSearchQuery && filteredFaqs.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 h-4 px-1 text-xs"
                >
                  {filteredFaqs.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manuals" className="space-y-4">
            {filteredManuals.length === 0 && hasSearchQuery
              ? renderEmptyState("manuals")
              : filteredManuals.map((manual, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <FileText className="w-4 h-4 text-red-500" />
                              <h4 className="font-medium">
                                {manual.title}
                              </h4>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {manual.description}
                            </p>
                            <div className="flex gap-2">
                              <Badge
                                variant="outline"
                                className="text-xs"
                              >
                                {manual.category}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="text-xs"
                              >
                                {manual.pages} pages
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <Button size="icon" variant="ghost">
                              <ExternalLink size={16} />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
          </TabsContent>

          <TabsContent value="videos" className="space-y-4">
            {filteredVideos.length === 0 && hasSearchQuery
              ? renderEmptyState("videos")
              : filteredVideos.map((video, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Video className="w-4 h-4 text-red-500" />
                              <h4 className="font-medium">
                                {video.title}
                              </h4>
                            </div>
                            <div className="flex gap-4 text-sm text-gray-600 mb-2">
                              <span>{video.duration}</span>
                              <span>{video.views} views</span>
                            </div>
                            <Badge
                              variant="outline"
                              className="text-xs"
                            >
                              {video.category}
                            </Badge>
                          </div>
                          <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                            <Video
                              size={16}
                              className="text-gray-500"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
          </TabsContent>

          <TabsContent value="success" className="space-y-4">
            {filteredSuccessStories.length === 0 &&
            hasSearchQuery
              ? renderEmptyState("success stories")
              : filteredSuccessStories.map((story, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Award className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <h4 className="font-medium mb-1">
                              {story.title}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              {story.location}
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-gray-600">
                                  Impact:
                                </span>
                                <div className="font-medium text-blue-600">
                                  {story.impact}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-600">
                                  Homes:
                                </span>
                                <div className="font-medium">
                                  {story.homes}
                                </div>
                              </div>
                            </div>
                            <div className="mt-2">
                              <span className="text-sm text-gray-600">
                                Annual Savings:{" "}
                              </span>
                              <span className="font-medium text-green-600">
                                {story.savings}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
          </TabsContent>

          <TabsContent value="faq" className="space-y-4">
            {filteredFaqs.length === 0 && hasSearchQuery
              ? renderEmptyState("FAQs")
              : filteredFaqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">
                          {faq.question}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {faq.answer}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}