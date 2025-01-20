import jsPDF from "jspdf"
import "jspdf-autotable"

export function generatePDFReport(data: any) {
  const doc = new jsPDF()

  // Add title
  doc.setFontSize(18)
  doc.text("Analytics Report", 14, 22)

  // Add date
  doc.setFontSize(11)
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30)

  // Add total revenue
  doc.setFontSize(14)
  doc.text(`Total Revenue: $${data.totalRevenue.toFixed(2)}`, 14, 40)

  // Add top tracks table
  doc.autoTable({
    head: [["Title", "Artist", "Plays"]],
    body: data.topTracks.map((track: any) => [track.title, track.artist, track.plays]),
    startY: 50,
  })

  // Save the PDF
  doc.save("analytics_report.pdf")
}

