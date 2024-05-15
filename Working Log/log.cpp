#include <iostream>
#include <fstream>
#include <ctime>
#include <string>
#include <vector>

void writeHeader(std::ofstream& file) {
    file << "<!DOCTYPE html>\n"
         << "<html lang=\"en\">\n"
         << "<head>\n"
         << "<meta charset=\"UTF-8\">\n"
         << "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n"
         << "<title>Activity Log</title>\n"
         << "<style>\n"
         << "  body { font-family: 'Helvetica', sans-serif; color: #333; background-color: #f4f4f4; margin: 40px; }\n"
         << "  h1 { color: #222; font-size: 24px; }\n"
         << "  h3 { color: #555; font-size: 18px; margin-top: 10px; }\n"
         << "  p { color: #666; font-size: 16px; margin-left: 20px; }\n"
         << "  hr { border: none; height: 1px; background-color: #ccc; margin-top: 20px; }\n"
         << "</style>\n"
         << "</head>\n"
         << "<body>\n";
}

void writeFooter(std::ofstream& file) {
    file << "</body>\n</html>";
}

std::string getLastDate() {
    std::ifstream file("activity_log.html");
    std::string line;
    std::string lastDate;
    while (getline(file, line)) {
        if (line.find("<h1>") != std::string::npos) {
            lastDate = line.substr(4, line.find("</h1>") - 4);
        }
    }
    return lastDate;
}

int main() {
    std::string lastDate = getLastDate();
    std::ofstream logFile("activity_log.html", std::ios::app);
    if (!logFile.is_open()) {
        std::cerr << "Error opening file!" << std::endl;
        return 1;
    }

    if (logFile.tellp() == 0) { // If file is empty, write the header
        writeHeader(logFile);
    }

    std::string input;
    std::cout << "Enter 'exit' to quit. Type '/delete [HH:MM:SS]' to delete an entry manually.\n";
    while (true) {
        std::cout << "What did you do? ";
        std::getline(std::cin, input);

        if (input == "exit") {
            writeFooter(logFile);
            break;
        }

        // Get current date and time
        time_t now = time(0);
        struct tm* now_tm = localtime(&now);
        char datebuf[80], timebuf[80];
        strftime(datebuf, sizeof(datebuf), "%A, %B %d, %Y", now_tm);
        strftime(timebuf, sizeof(timebuf), "%H:%M:%S", now_tm);

        std::string currentDate = datebuf;
        if (currentDate != lastDate) {
            if (!lastDate.empty()) {
                logFile << "</body>\n</html>"; // Close previous session's tags
                logFile.seekp(0, std::ios::end); // Go to the end of file to start a new session
                logFile << "<body>\n"; // Start new body
            }
            logFile << "<h1>" << currentDate << "</h1>\n";
            lastDate = currentDate;
        }

        logFile << "<h3>" << timebuf << "</h3>\n"
                << "<p>" << input << "</p>\n"
                << "<hr>\n"; // Divider line after each entry
    }

    logFile.close();
    return 0;
}
